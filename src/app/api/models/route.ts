import { AI_MODELS, getModelsByProvider } from "@/config/models";
import type { NextRequest } from "next/server";

// Make the route static for static exports
export const dynamic = "force-static";

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

export async function GET(req: NextRequest) {
  try {
    // Check if we should group by provider
    const grouped = req.nextUrl.searchParams.get("grouped") === "true";

    // Return either grouped or ungrouped models
    const response = new Response(
      JSON.stringify({
        models: grouped ? getModelsByProvider() : AI_MODELS,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return applyCorsHeaders(response);
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

    return applyCorsHeaders(errorResponse);
  }
}
