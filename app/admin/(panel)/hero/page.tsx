"use client"

import { useState } from "react"
import { CheckCircle2, Pencil, Plus, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { CMSHeroBanner } from "@/lib/cms/types"
import { HeroBannerDialog } from "@/components/admin/hero-banner-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCMSStore } from "@/stores/cms-store"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"
import { Spinner } from "@/components/ui/spinner"

export default function AdminHeroPage() {
  const hydrated = usePersistHydrated(useCMSStore((s) => s._hasHydrated))
  const heroBanners = useCMSStore((s) => s.heroBanners)
  const setHeroActive = useCMSStore((s) => s.setHeroActive)
  const deleteHeroBanner = useCMSStore((s) => s.deleteHeroBanner)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CMSHeroBanner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CMSHeroBanner | null>(null)

  const activeId = useCMSStore((s) => {
    const active = s.heroBanners.find((h) => h.isActive)
    return active?.id ?? s.heroBanners[0]?.id
  })

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </div>
    )
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteHeroBanner(deleteTarget.id)
    toast.success("Hero banner removed")
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Hero section</h1>
          <p className="text-sm text-muted-foreground">
            Manage homepage hero presets. Only one banner can be published at a time.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Plus className="mr-2 size-4" />
          Add banner
        </Button>
      </div>

      <div className="grid gap-4">
        {heroBanners.map((h) => {
          const published = h.id === activeId
          return (
            <Card key={h.id} className="border-border bg-card/70 p-5 backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold">{h.name}</p>
                    {published ? (
                      <Badge className="gap-1">
                        <Star className="size-3.5" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {h.eyebrow} · {h.badgeLabel}
                  </p>
                  <p className="text-base font-medium">
                    {h.titleBefore}{" "}
                    <span className="gradient-text">{h.titleHighlight}</span>
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{h.subtitle}</p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {!published ? (
                    <Button variant="outline" onClick={() => setHeroActive(h.id)}>
                      <CheckCircle2 className="mr-2 size-4" />
                      Publish
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(h)
                      setOpen(true)
                    }}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => setDeleteTarget(h)}>
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <HeroBannerDialog open={open} onOpenChange={setOpen} banner={editing} />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete hero banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name}</span>. If it was
              published, another banner becomes active automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
