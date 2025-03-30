import { anthropic } from "@ai-sdk/anthropic";
import type { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { NextRequest, NextResponse } from "next/server";

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
  // Get a mutable version of the response headers
  const headers = new Headers(response.headers);

  // Apply all CORS headers
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }

  // Create a new response with the same body, status, and updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  console.log("OPTIONS request received");
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  console.log("POST request received", req.headers.get("origin"));

  try {
    const { messages, provider = "openai" } = await req.json();

    if (provider === "openai") {
      const result = streamText({
        model: openai("gpt-4.5-preview"),
        messages,
      });

      // Get the standard response
      const response = result.toDataStreamResponse();
      // Apply CORS headers
      return applyCorsHeaders(response);
    }

    if (provider === "anthropic") {
      const result = streamText({
        model: anthropic("claude-3-7-sonnet-20250219"),
        messages,
        providerOptions: {
          anthropic: {
            thinking: { type: "enabled", budgetTokens: 12000 },
          } satisfies AnthropicProviderOptions,
        },
      });

      const response = result.toDataStreamResponse({
        sendReasoning: true,
      });

      // Apply CORS headers
      return applyCorsHeaders(response);
    }

    const errorResponse = new Response(JSON.stringify({ error: "Invalid provider" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Apply CORS headers
    return applyCorsHeaders(errorResponse);
  } catch (error) {
    console.error("API error:", error);

    const errorResponse = new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Apply CORS headers
    return applyCorsHeaders(errorResponse);
  }
}
