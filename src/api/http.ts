const API_BASE = "http://localhost:4000/api";

export const tokenStore = {
  get() {
    return localStorage.getItem("token");
  },
  set(t: string) {
    localStorage.setItem("token", t);
  },
  clear() {
    localStorage.removeItem("token");
  },
};

type Method = "GET" | "POST" | "PUT" | "DELETE";

export async function http<T>(path: string, opts?: { method?: Method; body?: unknown; auth?: boolean }): Promise<T> {
  const method = opts?.method ?? "GET";
  const auth = opts?.auth ?? true;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok) throw new Error(data?.message ?? `HTTP ${res.status}`);
  return data as T;
}
