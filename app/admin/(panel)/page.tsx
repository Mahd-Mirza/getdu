"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  ArrowRight,
  Boxes,
  FolderTree,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCMSStore } from "@/stores/cms-store"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"
import { Spinner } from "@/components/ui/spinner"

export default function AdminDashboardPage() {
  const hydrated = usePersistHydrated(useCMSStore((s) => s._hasHydrated))
  const products = useCMSStore((s) => s.products)
  const categories = useCMSStore((s) => s.categories)
  const settings = useCMSStore((s) => s.settings)
  const recentUpdates = useCMSStore((s) => s.recentUpdates)

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </div>
    )
  }

  const cards = [
    {
      title: "Total Products",
      value: products.length,
      hint: "Plans synced with the homepage catalog",
      icon: Boxes,
      href: "/admin/products",
    },
    {
      title: "Total Categories",
      value: categories.length,
      hint: "Mapped to package tabs",
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      title: "Total Users",
      value: settings.totalUsersDisplay.toLocaleString(),
      hint: "Marketing metric (editable)",
      icon: Users,
      href: "/admin/settings",
    },
    {
      title: "Recent Updates",
      value: recentUpdates.length ? `${recentUpdates.length}` : "0",
      hint: "Latest CMS actions",
      icon: RefreshCw,
      href: "/admin/products",
    },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Live connection · local shared state
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Overview</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage catalog content, homepage narrative, and merchandising. Updates persist in this
            browser and render instantly across the public site components wired to the CMS store.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/featured">
            Manage featured
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={c.href} className="block h-full">
              <Card className="group h-full border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {c.title}
                    </p>
                    <p className="text-3xl font-semibold tabular-nums">{c.value}</p>
                    <p className="text-sm text-muted-foreground">{c.hint}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/40 p-3 text-primary transition-colors group-hover:bg-primary/10">
                    <c.icon className="size-5" />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <Card className="border-border bg-card/70 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent updates</h2>
            <p className="text-sm text-muted-foreground">
              Audit trail for creates, edits, and deletes in this session.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            Newest first
          </Badge>
        </div>

        <div className="mt-6 divide-y divide-border rounded-xl border border-border">
          {recentUpdates.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No activity yet — make a change in Products or Hero to populate this feed.
            </div>
          ) : (
            recentUpdates.slice(0, 10).map((u) => (
              <div key={u.id} className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{u.label}</p>
                  <p className="text-xs text-muted-foreground">{u.detail || "—"}</p>
                </div>
                <p className="text-xs tabular-nums text-muted-foreground">
                  {formatDistanceToNow(new Date(u.at), { addSuffix: true })}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
