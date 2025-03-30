import { anthropic } from '@ai-sdk/anthropic';
import type { AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { NextRequest, NextResponse } from 'next/server';

// Allow responses up to 30 seconds
export const maxDuration = 30;

// CORS headers for all environments
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins including Chrome extensions
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
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
  console.log('OPTIONS request received');
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  console.log('POST request received', req.headers.get('origin'));

  try {
    const body = await req.json();
    const { messages, provider = 'openai', currentUrl = null } = body;

    // Debug information
    console.log(
      'Request body:',
      JSON.stringify({
        messageCount: messages.length,
        provider,
        currentUrl,
        hasAttachments: messages.some((m: any) => m.experimental_attachments?.length > 0),
      })
    );

    // Log the actual message structure for debugging
    console.log('Last message:', JSON.stringify(messages[messages.length - 1], null, 2));

    // Log details about any attachments
    const attachmentDetails = messages
      .filter((m: any) => m.experimental_attachments?.length > 0)
      .map((m: any) => ({
        role: m.role,
        attachmentCount: m.experimental_attachments?.length,
        types: m.experimental_attachments?.map((a: any) => a.contentType),
      }));

    if (attachmentDetails.length > 0) {
      console.log('Attachment details:', JSON.stringify(attachmentDetails));
    }

    // Add system message with current URL context if available
    const systemContextMessage = currentUrl
      ? {
          role: 'system',
          content: `The user is currently on the webpage: ${currentUrl}. Please take this into account in your responses where relevant.`,
        }
      : null;

    // Add system message to the beginning of messages array if it exists
    const messagesWithContext = systemContextMessage
      ? [systemContextMessage, ...messages]
      : messages;

    // Check if user has sent a PDF - if so, use Anthropic as it handles PDFs better
    const messagesHavePDF = messages.some((message: any) =>
      message.experimental_attachments?.some((a: any) => a.contentType === 'application/pdf')
    );

    // Check if user has sent any images
    const messagesHaveImages = messages.some((message: any) =>
      message.experimental_attachments?.some((a: any) => a.contentType?.startsWith('image/'))
    );

    console.log('Message has PDFs:', messagesHavePDF);
    console.log('Message has images:', messagesHaveImages);

    // Use different provider based on attachment types
    const effectiveProvider = messagesHavePDF ? 'anthropic' : provider;

    if (effectiveProvider === 'openai') {
      const result = streamText({
        model: openai('gpt-4o'),
        messages: messagesWithContext,
      });

      // Get the standard response
      const response = result.toDataStreamResponse();
      // Apply CORS headers
      return applyCorsHeaders(response);
    }

    if (effectiveProvider === 'anthropic') {
      const result = streamText({
        model: anthropic('claude-3-7-sonnet-20250219'),
        messages: messagesWithContext,
        providerOptions: {
          anthropic: {
            thinking: { type: 'enabled', budgetTokens: 12000 },
          } satisfies AnthropicProviderOptions,
        },
      });

      const response = result.toDataStreamResponse({
        sendReasoning: true,
      });

      // Apply CORS headers
      return applyCorsHeaders(response);
    }

    const errorResponse = new Response(JSON.stringify({ error: 'Invalid provider' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Apply CORS headers
    return applyCorsHeaders(errorResponse);
  } catch (error) {
    console.error('API error:', error);

    const errorResponse = new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Apply CORS headers
    return applyCorsHeaders(errorResponse);
  }
}
