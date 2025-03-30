/**
 * API Configuration
 *
 * This file contains API-related configuration settings
 * that can be used throughout the application.
 */

/**
 * Base URL for API requests:
 * - In development mode: Uses localhost
 * - In production mode: Uses relative paths
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_MODE === 'development' ? 'http://localhost:3000' : '';

// Log environment information in development
if (process.env.NODE_ENV === 'development') {
  console.log('API mode:', process.env.NEXT_PUBLIC_API_MODE);
  console.log('API base URL:', API_BASE_URL);
}
