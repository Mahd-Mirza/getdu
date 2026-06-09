import { cmsStateToPersist, useCMSStore } from "@/stores/cms-store"

export type PersistCmsResult =
  | { ok: true; storage: "blob" | "file" }
  | { ok: false; error: string; storage?: string }

/** Push the current Zustand CMS slice to `/api/cms` (shared by admin + background sync). */
export async function persistCmsToServer(): Promise<PersistCmsResult> {
  const payload = cmsStateToPersist(useCMSStore.getState())

  const res = await fetch("/api/cms", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const storage = res.headers.get("X-CMS-Storage") ?? undefined

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    return {
      ok: false,
      error: body?.error ?? `Save failed (${res.status})`,
      storage,
    }
  }

  return {
    ok: true,
    storage: storage === "blob" || storage === "file" ? storage : "file",
  }
}

export function notifyPersistFailure(error: string) {
  if (typeof window === "undefined") return
  if (!window.location.pathname.startsWith("/admin")) return

  import("sonner").then(({ toast }) => {
    toast.error("Changes not saved to server", {
      description: error,
      duration: 12_000,
    })
  })
}
