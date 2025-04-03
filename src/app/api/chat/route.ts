import { getDefaultModelId, getModelById } from "@/config/models";
import { closeMCPClient, getMCPClient } from "@/lib/mcp-client";
import { registry } from "@/lib/providers";
import { streamText } from "ai";
import type { NextRequest } from "next/server";

// Make the route static for static exports
export const dynamic = "force-static";

// Allow responses up to 30 seconds
export const maxDuration = 30;

// CORS headers for all environments
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins including Chrome extensions
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400", // 24 hours
};

// Apply CORS headers to any response
function applyCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  console.log("POST request received", req.headers.get("origin"));
  let mcpClient = null;

  try {
    const body = await req.json();
    const {
      messages,
      modelId = null,
      currentUrl = null,
      useMcpTools = true,
      useReasoning = true,
    } = body;

    // Initialize MCP client only if tools are requested
    if (useMcpTools) {
      try {
        mcpClient = await getMCPClient();
      } catch (e) {
        console.error("Failed to initialize MCP client:", e);
      }
    }

    // Determine provider and model
    const { provider, effectiveModelId } = determineProviderAndModel(messages, modelId);

    // Log request information
    logRequestDetails(messages, effectiveModelId, provider, currentUrl, useReasoning);

    // Add system context message if URL is provided
    const messagesWithContext = addContextMessage(messages, currentUrl);

    // Get MCP tools if available
    const mcpTools = useMcpTools && mcpClient ? await mcpClient.tools() : null;

    // Stream response based on provider
    const response = await streamResponse(
      provider,
      effectiveModelId,
      messagesWithContext,
      mcpTools,
      mcpClient,
      useReasoning
    );

    return applyCorsHeaders(response);
  } catch (error) {
    console.error("API error:", error);

    // Close MCP client in case of error
    if (mcpClient) {
      try {
        await closeMCPClient();
      } catch (e) {
        console.error("Error closing MCP client:", e);
      }
    }

    return applyCorsHeaders(
      new Response(
        JSON.stringify({ error: "Internal server error", details: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    );
  }
}

// Helper function to determine provider and model ID
function determineProviderAndModel(messages: any[], requestedModelId: string | null) {
  let provider = "openai"; // Default provider
  let effectiveModelId: string | null = requestedModelId;

  // If model ID is specified, get provider from model info
  if (requestedModelId) {
    const modelInfo = getModelById(requestedModelId);
    provider = modelInfo?.provider || "openai";
  } else {
    // Check if message has PDF to default to Anthropic
    const messagesHavePDF = messages.some((message: any) =>
      message.experimental_attachments?.some(
        (a: any) => a.contentType === "application/pdf"
      )
    );

    if (messagesHavePDF) {
      provider = "anthropic";
    }

    // Use default model for the provider
    effectiveModelId = getDefaultModelId(provider);
  }

  return { provider, effectiveModelId: effectiveModelId || getDefaultModelId(provider) };
}

// Helper function to log request details
function logRequestDetails(
  messages: any[],
  modelId: string | null,
  provider: string,
  currentUrl: string | null,
  useReasoning: boolean
) {
  console.log(
    "Request body:",
    JSON.stringify({
      messageCount: messages.length,
      modelId,
      provider,
      currentUrl,
      useReasoning,
      hasAttachments: messages.some((m: any) => m.experimental_attachments?.length > 0),
    })
  );

  console.log("Last message:", JSON.stringify(messages[messages.length - 1], null, 2));

  // Log attachment details
  const attachmentDetails = messages
    .filter((m: any) => m.experimental_attachments?.length > 0)
    .map((m: any) => ({
      role: m.role,
      attachmentCount: m.experimental_attachments?.length,
      types: m.experimental_attachments?.map((a: any) => a.contentType),
    }));

  if (attachmentDetails.length > 0) {
    console.log("Attachment details:", JSON.stringify(attachmentDetails));
  }

  // Log media types
  const messagesHavePDF = messages.some((message: any) =>
    message.experimental_attachments?.some(
      (a: any) => a.contentType === "application/pdf"
    )
  );
  const messagesHaveImages = messages.some((message: any) =>
    message.experimental_attachments?.some((a: any) =>
      a.contentType?.startsWith("image/")
    )
  );
  console.log("Message has PDFs:", messagesHavePDF);
  console.log("Message has images:", messagesHaveImages);
}

// Helper function to add context message about current URL
function addContextMessage(messages: any[], currentUrl: string | null) {
  if (!currentUrl) return messages;

  const systemContextMessage = {
    role: "system",
    content: `The user is currently on the webpage: ${currentUrl}. Please take this into account in your responses where relevant.`,
  };

  return [systemContextMessage, ...messages];
}

// Helper function to stream responses based on provider
async function streamResponse(
  provider: string,
  modelId: string | null,
  messages: any[],
  mcpTools: any,
  mcpClient: any,
  useReasoning: boolean
) {
  // Ensure we have a valid model ID, falling back to default if needed
  const effectiveModelId = modelId || getDefaultModelId(provider);

  const onFinish = async () => {
    console.log(`Closing MCP client after ${provider} response`);
    await closeMCPClient();
  };

  // Handle invalid provider
  if (provider !== "openai" && provider !== "anthropic") {
    return new Response(JSON.stringify({ error: "Invalid provider or model" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Determine model from registry
  let model;
  if (provider === "anthropic") {
    // Use the specific model aliases if available
    if (useReasoning) {
      model = registry.languageModel("anthropic:reasoning");
    } else {
      // For faster responses without reasoning, use the "fast" model
      model = registry.languageModel("anthropic:fast");
    }
  } else {
    // For non-Anthropic providers, use the fallback
    // TODO: Add other providers to the registry
    model = registry.languageModel(`anthropic:${effectiveModelId}`);
  }

  // Single streamText call with conditional parameters
  const result = streamText({
    model,
    messages,
    ...(mcpTools ? { tools: mcpTools, maxSteps: 10 } : {}),
    ...(mcpTools ? { onFinish } : {}),
  });

  return result.toDataStreamResponse({
    ...(useReasoning ? { sendReasoning: true } : {}),
  });
}
