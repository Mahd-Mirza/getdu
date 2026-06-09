"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type StorageStatus = "checking" | "blob" | "kv" | "file" | "none" | "error"

const VERCEL_STORAGE_URL = "https://vercel.com/dashboard/stores"

export function CmsStorageBanner() {
  const [status, setStatus] = useState<StorageStatus>("checking")
  const [detail, setDetail] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/cms", { cache: "no-store" })
        if (cancelled) return

        const mode = res.headers.get("X-CMS-Storage") as StorageStatus | null
        if (mode === "blob") {
          setStatus("blob")
          setDetail("Dashboard changes sync to all browsers and devices.")
          return
        }
        if (mode === "kv") {
          setStatus("kv")
          setDetail("Dashboard changes sync via Vercel KV to all visitors.")
          return
        }
        if (mode === "file") {
          setStatus("file")
          setDetail("Local dev uses data/cms.json on disk — fine for testing on this machine.")
          return
        }
        if (mode === "none") {
          setStatus("none")
          setDetail(
            "Production has no persistent database. Connect Vercel Blob or KV, redeploy, then save products again.",
          )
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

  const ok = status === "blob" || status === "kv" || status === "file"

  return (
    <Card
      className={`space-y-4 border p-4 ${
        ok
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-amber-500/40 bg-amber-500/10"
      }`}
    >
      <div className="flex gap-3">
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
      </div>

      {status === "none" ? (
        <div className="space-y-3 rounded-lg border border-amber-500/20 bg-background/60 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Fix in 3 steps (about 2 minutes)</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Open{" "}
              <Link
                href={VERCEL_STORAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Vercel → Storage
              </Link>{" "}
              and click <strong className="text-foreground">Create Database</strong>.
            </li>
            <li>
              Choose <strong className="text-foreground">Blob</strong> (recommended) or{" "}
              <strong className="text-foreground">KV</strong>, then connect it to your{" "}
              <strong className="text-foreground">getdu</strong> project.
            </li>
            <li>
              Redeploy the site, return here, edit a product, and save. This page should turn
              green.
            </li>
          </ol>
          <Button asChild size="sm" variant="outline" className="gap-2">
            <Link href={VERCEL_STORAGE_URL} target="_blank" rel="noopener noreferrer">
              Open Vercel Storage
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
