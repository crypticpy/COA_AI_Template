/**
 * Base API client for communicating with the backend
 * 
 * TODO: Customize endpoints for your application
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  token?: string;
}

interface ApiError {
  message: string;
  status: number;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `API Error: ${response.statusText}`,
      status: response.status,
    };
    
    try {
      const errorData = await response.json();
      error.message = errorData.detail || errorData.message || error.message;
    } catch {
      // Use default message if parsing fails
    }
    
    throw error;
  }

  return response.json();
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  return apiRequest('/api/v1/health');
}

// TODO: Add your application-specific API functions here
// Example:
// export async function getItems(token: string): Promise<Item[]> {
//   return apiRequest('/api/v1/items', { token });
// }
