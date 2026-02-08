// src/lib/api.ts
type ApiError = { error: string };

export async function apiFetch<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
  });

  if (!res.ok) {
    let msg = "Greška";
    try {
      const data = (await res.json()) as ApiError;
      msg = data?.error ?? msg;
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as T;
}