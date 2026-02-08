const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!BASE) throw new Error("Missing NEXT_PUBLIC_API_URL");

  const res = await fetch(`${BASE}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data as T;
}