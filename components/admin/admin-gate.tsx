"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { Spinner } from "@/components/ui/spinner"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"
import { useAuthStore } from "@/stores/auth-store"

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const authed = useAuthStore((s) => s.isAuthenticated)
  const hydratedFlag = useAuthStore((s) => s._hasHydrated)
  const hydrated = usePersistHydrated(hydratedFlag)

  useEffect(() => {
    if (!hydrated) return
    if (!authed) router.replace("/admin/login")
  }, [hydrated, authed, router])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-10 text-primary" />
      </div>
    )
  }

  if (!authed) return null

  return <AdminShell>{children}</AdminShell>
}
