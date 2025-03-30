/**
 * Utility functions for interacting with Chrome extension APIs
 */

// Chrome extension types
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage?: (
          message: { action: string; [key: string]: unknown },
          callback: (response: { url?: string }) => void
        ) => void;
      };
    };
  }
}

/**
 * Gets the current tab URL using Chrome's API
 * @returns Promise that resolves to the current tab URL or the current window URL if not in a Chrome extension context
 */
export const getCurrentTabUrl = async (): Promise<string | null> => {
  // Check if we're in a Chrome extension context
  if (typeof window !== 'undefined' && window.chrome?.runtime?.sendMessage) {
    try {
      // Send message to background script to get current tab URL
      return new Promise<string | null>((resolve) => {
        const sendMessage = window.chrome?.runtime?.sendMessage;
        if (!sendMessage) {
          resolve(null);
          return;
        }

        sendMessage({ action: 'getCurrentTabUrl' }, (response: { url?: string }) => {
          if (response?.url) {
            resolve(response.url);
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Error getting current tab URL:', error);
      return null;
    }
  }

  // Not in Chrome extension context, return current window URL if available
  if (typeof window !== 'undefined') {
    return window.location.href;
  }

  // No window object available (SSR)
  return null;
};
