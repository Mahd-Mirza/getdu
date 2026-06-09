"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

type StorageStatus = "checking" | "blob" | "file" | "error"

export function CmsStorageBanner() {
  const [status, setStatus] = useState<StorageStatus>("checking")
  const [detail, setDetail] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/cms", { cache: "no-store" })
        if (cancelled) return
        const mode = res.headers.get("X-CMS-Storage")
        if (mode === "blob") {
          setStatus("blob")
          setDetail("Dashboard changes sync to all browsers and devices.")
          return
        }
        if (mode === "file") {
          const onVercel = window.location.hostname !== "localhost"
          if (onVercel) {
            setStatus("error")
            setDetail(
              "Production is using temporary file storage. Add Vercel Blob (Vercel → Storage → Blob) and redeploy so updates reach every visitor.",
            )
          } else {
            setStatus("file")
            setDetail("Local dev uses data/cms.json on disk — fine for testing on this machine.")
          }
          return
        }
        setStatus("error")
        setDetail("Could not detect CMS storage mode.")
      } catch {
        if (!cancelled) {
          setStatus("error")
          setDetail("Could not reach /api/cms.")
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (status === "checking") return null

  const ok = status === "blob" || (status === "file" && detail.includes("Local dev"))

  return (
    <Card
      className={`flex gap-3 border p-4 ${
        ok
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-amber-500/40 bg-amber-500/10"
      }`}
    >
      {ok ? (
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
      ) : (
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
      )}
      <div className="space-y-1 text-sm">
        <p className="font-medium text-foreground">
          {ok ? "CMS storage connected" : "CMS storage needs setup"}
        </p>
        <p className="text-muted-foreground">{detail}</p>
      </div>
    </Card>
  )
}
