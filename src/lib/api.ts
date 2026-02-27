type ApiError = { error?: string; message?: string };

const API_BASE = "http://localhost:3001"; // backend

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  console.log("[apiFetch] Fetching:", fullUrl, "with options:", init);

  const res = await fetch(fullUrl, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include", // ← obavezno za cookie autentikaciju
  });

  console.log("[apiFetch] Response status:", res.status);

  if (!res.ok) {
    let msg = "Greška";
    try {
      const data = (await res.json()) as ApiError;
      msg =
        data?.error || data?.message || `HTTP ${res.status} ${res.statusText}`;
      console.log("[apiFetch] Error response data:", data);
    } catch (e) {
      console.log("[apiFetch] Error parsing response:", e);
    }
    throw new Error(msg);
  }

  const data = (await res.json()) as T;
  console.log("[apiFetch] Response data:", data);
  return data;
}
