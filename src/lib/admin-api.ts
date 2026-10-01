export class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function adminFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(`/backend${path}`, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init.body && !isForm ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && !path.startsWith("/auth/login")) {
    await fetch("/backend/auth/logout", { method: "POST" }).catch(() => {});
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  if (!res.ok) throw new AdminApiError(res.status, data.message || "Request failed. Please try again.");
  return data as T;
}

export const api = {
  get: <T>(path: string) => adminFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    adminFetch<T>(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body: unknown) => adminFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  del: <T>(path: string) => adminFetch<T>(path, { method: "DELETE" }),
};

export async function refreshSite() {
  await fetch("/api/revalidate", { method: "POST" }).catch(() => {});
}

export function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong.";
}
