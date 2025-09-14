const API_BASE = "http://localhost:8080/api";

export async function api(path, method = "GET", token = null, body = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, config);

    // Handle 204 (No Content) responses
    if (res.status === 204) {
      return null;
    }

    // Clone the response to avoid "body stream already read" errors
    const resClone = res.clone();

    // Parse the response body once
    let data;
    try {
      data = await res.json();
    } catch {
      // If JSON parsing fails, try to get text
      const text = await resClone.text();
      throw new Error(text || `HTTP error! Status: ${res.status}`);
    }

    if (!res.ok) {
      // Extract error message from the response
      const errorMessage =
        data.message ||
        data.error ||
        data.details ||
        `HTTP error! Status: ${res.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Re-throw with a user-friendly message
    throw new Error(
      error.message ||
      "Failed to connect to the server. Please check your connection."
    );
  }
}
