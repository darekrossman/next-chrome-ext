import { anthropic } from "@ai-sdk/anthropic";
import type { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { NextRequest } from "next/server";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages, provider = "openai" } = await req.json();

  if (provider === "openai") {
    const result = streamText({
      model: openai("gpt-4.5-preview"),
      messages,
    });

    return result.toDataStreamResponse();
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

    return result.toDataStreamResponse({
      sendReasoning: true,
    });
  }

  return new Response(JSON.stringify({ error: "Invalid provider" }), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
