// apiClient.js

export const BASE_URL = "http://localhost:3100";
const BACKEND_API_KEY = process.env.REACT_APP_BACKEND_API_KEY;

if (!BACKEND_API_KEY) {
  throw new Error(
    "Missing API Key! Please check your .env file and build config."
  );
}

// Common headers are prepared once
const getAuthHeader = (contentType = "application/json") => ({
  "Content-Type": contentType,
  Authorization: `ApiKey ${BACKEND_API_KEY}`,
});

/**
 * A central function to call any API endpoint using different HTTP methods.
 * It now returns the raw 'Response' object for the caller to process (e.g., .json()).
 * * @param {string} endpoint The specific path after the BASE_URL (e.g., /api/projects).
 * @param {string} method The HTTP method (GET, POST, PUT, DELETE, PATCH). Default is GET.
 * @param {object | null} body The request body data for POST/PUT/PATCH.
 * @returns {Promise<Response>} The raw Fetch API Response object.
 */
export const apiRequest = async (endpoint, method = "GET", body = null) => {
  if (typeof endpoint !== "string") {
    throw new Error(`Invalid endpoint: Must be a string.`);
  }

  const url = `${BASE_URL}${endpoint}`; // Prepare options based on method and body

  const options = {
    method: method.toUpperCase(),
    headers: getAuthHeader(),
  }; // Only add a 'body' property if a body is provided AND the method is not 'GET' or 'HEAD'

  if (body && options.method !== "GET" && options.method !== "HEAD") {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options); // 1. Check for bad HTTP status (4xx, 5xx). This is crucial!

    if (!response.ok) {
      // Still need to read the error body to provide a good error message
      const errorText = await response.text();
      throw new Error(
        `API call failed: ${response.status} ${
          response.statusText
        } for ${url}. Details: ${errorText.substring(0, 100)}...`
      );
    } // 2. 🎯 SIMPLIFIED: Just return the successful Response object! // The calling function (e.g., in the component/service) will call .json() or .text().

    return response;
  } catch (error) {
    console.error(`Error in apiRequest for ${url}:`, error);
    throw error; // Re-throw the error for the caller
  }
};

// --- Convenience Functions (They still call apiRequest and return the raw Response) ---

export const get = (endpoint) => apiRequest(endpoint, "GET");

export const post = (endpoint, body) => apiRequest(endpoint, "POST", body);

export const put = (endpoint, body) => apiRequest(endpoint, "PUT", body);

export const patch = (endpoint, body) => apiRequest(endpoint, "PATCH", body);

export const del = (endpoint) => apiRequest(endpoint, "DELETE");
