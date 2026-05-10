"use client"

import { useEffect, useRef } from "react"
import { useCMSStore, cmsStateToPersist, CMS_STORAGE_KEY } from "@/stores/cms-store"
import type { CMSStore } from "@/stores/cms-store"

function hadPersistedClientSnapshot(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(CMS_STORAGE_KEY) != null
  } catch {
    return false
  }
}

function newestIsoMs(slice: ReturnType<typeof cmsStateToPersist>): number {
  let t = 0
  for (const p of slice.products) {
    const x = Date.parse(p.updatedAt)
    if (Number.isFinite(x) && x > t) t = x
  }
  for (const r of slice.recentUpdates) {
    const x = Date.parse(r.at)
    if (Number.isFinite(x) && x > t) t = x
  }
  return t
}

/**
 * Loads CMS from the server after localStorage hydration, and saves edits back.
 * Without this, dashboard changes only exist in the admin browser's localStorage,
 * so the public site keeps showing seed prices for most visitors.
 */
export function CmsServerSync() {
  const hydrated = useCMSStore((s) => s._hasHydrated)
  const applyingRemote = useRef(false)

  useEffect(() => {
    if (!hydrated) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/cms", { cache: "no-store" })
        if (!res.ok || cancelled) return
        const data = await res.json()
        if (!data || typeof data !== "object" || cancelled) return

        const serverSlice = data as ReturnType<typeof cmsStateToPersist>

        const clientSlice = cmsStateToPersist(useCMSStore.getState())
        const hadLocal = hadPersistedClientSnapshot()

        if (
          hadLocal &&
          newestIsoMs(serverSlice) < newestIsoMs(clientSlice)
        ) {
          return
        }

        applyingRemote.current = true
        useCMSStore.setState(serverSlice as Partial<CMSStore>)
        queueMicrotask(() => {
          applyingRemote.current = false
        })
      } catch {
        /* offline or invalid JSON */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [hydrated])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const unsub = useCMSStore.subscribe((state) => {
      if (!state._hasHydrated || applyingRemote.current) return

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        const payload = cmsStateToPersist(useCMSStore.getState())
        fetch("/api/cms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {})
      }, 450)
    })

    return () => {
      clearTimeout(timeout)
      unsub()
    }
  }, [])

  return null
}
