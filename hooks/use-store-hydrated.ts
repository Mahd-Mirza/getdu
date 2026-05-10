"use client"

import { useEffect, useState } from "react"

/**
 * Avoid auth/CMS redirect flashes before Zustand persist finishes rehydrating.
 */
export function usePersistHydrated(hasHydratedFlag: boolean) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted && hasHydratedFlag
}
