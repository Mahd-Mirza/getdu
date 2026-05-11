"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { toast } from "sonner"
import type { CMSHeroBanner } from "@/lib/cms/types"
import { heroBannerSchema } from "@/lib/cms/schemas"
import { useCMSStore } from "@/stores/cms-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type HeroFormValues = z.infer<typeof heroBannerSchema>

function toForm(b?: CMSHeroBanner | null): HeroFormValues {
  if (!b) {
    return {
      name: "New homepage hero",
      eyebrow: "UAE · Residential",
      badgeLabel: "Services At Your Doorstep",
      titleBefore: "Home",
      titleHighlight: "Internet",
      subtitle:
        "25% discount for 24 months or 2 months free — router included. Fiber & 5G plans for UAE homes.",
      feature1: "Doorstep signup & installation",
      feature2: "Authorized du partner",
      feature3: "Dedicated customer care",
      primaryCtaLabel: "View Plans",
      primaryCtaHref: "#plans",
      secondaryCtaLabel: "Get Connected",
      secondaryCtaHref: "#contact",
      speedPrimary: "Up to",
      speedHighlight: "1 Gbps",
      heroSideImage: "",
      isActive: false,
    }
  }

  return {
    name: b.name,
    eyebrow: b.eyebrow,
    badgeLabel: b.badgeLabel,
    titleBefore: b.titleBefore,
    titleHighlight: b.titleHighlight,
    subtitle: b.subtitle,
    feature1: b.feature1,
    feature2: b.feature2,
    feature3: b.feature3,
    primaryCtaLabel: b.primaryCtaLabel,
    primaryCtaHref: b.primaryCtaHref,
    secondaryCtaLabel: b.secondaryCtaLabel,
    secondaryCtaHref: b.secondaryCtaHref,
    speedPrimary: b.speedPrimary,
    speedHighlight: b.speedHighlight,
    heroSideImage: b.heroSideImage ?? "",
    isActive: b.isActive,
  }
}

export function HeroBannerDialog({
  open,
  onOpenChange,
  banner,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: CMSHeroBanner | null
}) {
  const upsertHeroBanner = useCMSStore((s) => s.upsertHeroBanner)

  const defaults = useMemo(() => toForm(banner), [banner])

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroBannerSchema),
    defaultValues: defaults,
  })

  useEffect(() => {
    if (open) form.reset(toForm(banner))
  }, [open, banner, form])

  function onSubmit(values: HeroFormValues) {
    upsertHeroBanner({
      id: banner?.id,
      name: values.name.trim(),
      eyebrow: values.eyebrow.trim(),
      badgeLabel: values.badgeLabel.trim(),
      titleBefore: values.titleBefore.trim(),
      titleHighlight: values.titleHighlight.trim(),
      subtitle: values.subtitle.trim(),
      feature1: values.feature1.trim(),
      feature2: values.feature2.trim(),
      feature3: values.feature3.trim(),
      primaryCtaLabel: values.primaryCtaLabel.trim(),
      primaryCtaHref: values.primaryCtaHref.trim(),
      secondaryCtaLabel: values.secondaryCtaLabel.trim(),
      secondaryCtaHref: values.secondaryCtaHref.trim(),
      speedPrimary: values.speedPrimary.trim(),
      speedHighlight: values.speedHighlight.trim(),
      heroSideImage: values.heroSideImage?.trim() || undefined,
      isActive: values.isActive,
    })

    toast.success(banner ? "Hero banner updated" : "Hero banner created")
    onOpenChange(false)
  }

  const img = form.watch("heroSideImage")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,920px)] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle>{banner ? "Edit hero banner" : "Add hero banner"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[min(72vh,760px)] px-6 py-5">
            <div className="grid gap-4 pb-2">
              <div className="space-y-2">
                <Label htmlFor="hb-name">Admin label</Label>
                <Input id="hb-name" {...form.register("name")} />
                {form.formState.errors.name ? (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hb-eyebrow">Eyebrow</Label>
                  <Input id="hb-eyebrow" {...form.register("eyebrow")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hb-badge">Badge</Label>
                  <Input id="hb-badge" {...form.register("badgeLabel")} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hb-t1">Title (before highlight)</Label>
                  <Input id="hb-t1" {...form.register("titleBefore")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hb-th">Highlighted word</Label>
                  <Input id="hb-th" {...form.register("titleHighlight")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hb-sub">Subtitle</Label>
                <Textarea id="hb-sub" rows={4} {...form.register("subtitle")} />
                {form.formState.errors.subtitle ? (
                  <p className="text-xs text-destructive">{form.formState.errors.subtitle.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="hb-f1">Feature 1</Label>
                  <Input id="hb-f1" {...form.register("feature1")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hb-f2">Feature 2</Label>
                  <Input id="hb-f2" {...form.register("feature2")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hb-f3">Feature 3</Label>
                  <Input id="hb-f3" {...form.register("feature3")} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hb-pc">Primary CTA label</Label>
                  <Input id="hb-pc" {...form.register("primaryCtaLabel")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hb-ph">Primary CTA href</Label>
                  <Input id="hb-ph" {...form.register("primaryCtaHref")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hb-sc">Secondary CTA label</Label>
                  <Input id="hb-sc" {...form.register("secondaryCtaLabel")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hb-sh">Secondary CTA href</Label>
                  <Input id="hb-sh" {...form.register("secondaryCtaHref")} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hb-sp">Speed label</Label>
                  <Input id="hb-sp" {...form.register("speedPrimary")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hb-shi">Speed highlight</Label>
                  <Input id="hb-shi" {...form.register("speedHighlight")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hb-img">Hero side image URL (optional)</Label>
                <Input id="hb-img" {...form.register("heroSideImage")} placeholder="/router.png" />
                <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img?.trim() ? img.trim() : "/logo.png"}
                    alt="Hero preview"
                    className="h-44 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/logo.png"
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 p-4">
                <div>
                  <p className="text-sm font-medium">Publish immediately</p>
                  <p className="text-xs text-muted-foreground">
                    Makes this banner active on the marketing homepage.
                  </p>
                </div>
                <Switch
                  checked={form.watch("isActive")}
                  onCheckedChange={(v) => form.setValue("isActive", v)}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
