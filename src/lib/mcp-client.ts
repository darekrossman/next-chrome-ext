import { experimental_createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio';

// Define a generic type for the MCP client since the actual type is internal
type MCPClient = ReturnType<typeof experimental_createMCPClient> extends Promise<infer T>
  ? T
  : never;

let cachedClient: MCPClient | null = null;

/**
 * Creates and returns an MCP client for Firecrawl.
 * Uses a cached client if one exists, otherwise creates a new one.
 */
export async function getMCPClient() {
  console.log('Getting MCP client');
  if (cachedClient) {
    return cachedClient;
  }

  try {
    // Initialize MCP client with Stdio transport using npx command
    cachedClient = await experimental_createMCPClient({
      transport: new StdioMCPTransport({
        command: 'npx',
        args: ['-y', 'firecrawl-mcp'],
        env: {
          FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY || 'fc-0ce08d431bce48df965686c7076e05a6',
        },
      }),
    });

    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize MCP client:', error);
    throw error;
  }
}

/**
 * Closes the MCP client if it exists
 */
export async function closeMCPClient() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
  }
}
