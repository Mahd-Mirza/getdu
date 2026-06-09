"use client"

import { useEffect, useRef } from "react"
import { useCMSStore, cmsStateToPersist } from "@/stores/cms-store"
import type { CMSStore } from "@/stores/cms-store"
import { notifyPersistFailure, persistCmsToServer } from "@/lib/cms/persist-server"

/**
 * Loads CMS from the server after localStorage hydration, and saves edits back.
 * Server data is the source of truth for all visitors — localStorage is only a cache.
 */
export function CmsServerSync() {
  const hydrated = useCMSStore((s) => s._hasHydrated)
  const applyingRemote = useRef(false)
  /** Block PUT until the first server pull finishes — avoids overwriting cms.json with seed data. */
  const serverPullDone = useRef(false)

  useEffect(() => {
    if (!hydrated) return
    let cancelled = false
    serverPullDone.current = false
    ;(async () => {
      try {
        const res = await fetch("/api/cms", { cache: "no-store" })
        if (cancelled) return
        if (!res.ok) {
          return
        }
        const data = await res.json()
        if (!data || typeof data !== "object" || cancelled) return

        const serverSlice = data as ReturnType<typeof cmsStateToPersist>

        applyingRemote.current = true
        useCMSStore.setState(serverSlice as Partial<CMSStore>)
        queueMicrotask(() => {
          applyingRemote.current = false
        })
      } catch {
        /* offline or invalid JSON */
      } finally {
        if (!cancelled) serverPullDone.current = true
      }
    })()
    return () => {
      cancelled = true
    }
  }, [hydrated])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const unsub = useCMSStore.subscribe(() => {
      const state = useCMSStore.getState()
      if (
        !state._hasHydrated ||
        !serverPullDone.current ||
        applyingRemote.current
      ) {
        return
      }

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        persistCmsToServer().then((result) => {
          if (!result.ok) notifyPersistFailure(result.error)
        })
      }, 450)
    })

    return () => {
      clearTimeout(timeout)
      unsub()
    }
  }, [])

  return null
}
