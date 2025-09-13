const API_BASE = "http://localhost:8080/api";

export async function api(path, method = "GET", token = null, body = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 204 (No Content) responses gracefully
  if (res.status === 204) {
    return null;
  }

  if (!res.ok) {
    let errorMessage;
    try {
      errorMessage = await res.json();
    } catch {
      errorMessage = await res.text();
    }
    throw new Error(errorMessage?.message || res.statusText);
  }

  return res.json();
}
