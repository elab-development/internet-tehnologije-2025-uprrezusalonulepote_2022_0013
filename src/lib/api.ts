type ApiError = { error?: string; message?: string };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"; // backend

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  const res = await fetch(fullUrl, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
  });

  if (!res.ok) {
    let msg = "Greška";
    try {
      const data = (await res.json()) as ApiError;
      msg = data?.error || data?.message || `HTTP ${res.status} ${res.statusText}`;
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as T;
}