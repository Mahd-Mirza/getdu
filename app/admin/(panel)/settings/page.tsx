"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { toast } from "sonner"
import { settingsSchema } from "@/lib/cms/schemas"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCMSStore } from "@/stores/cms-store"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"
import { Spinner } from "@/components/ui/spinner"

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function AdminSettingsPage() {
  const hydrated = usePersistHydrated(useCMSStore((s) => s._hasHydrated))
  const settings = useCMSStore((s) => s.settings)
  const patchSettings = useCMSStore((s) => s.patchSettings)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      whatsappPhoneDigits: settings.whatsappPhoneDigits,
      totalUsersDisplay: settings.totalUsersDisplay,
      plansSectionTitle: settings.plansSectionTitle,
      plansSectionSubtitle: settings.plansSectionSubtitle,
    },
  })

  useEffect(() => {
    if (!hydrated) return
    form.reset({
      whatsappPhoneDigits: settings.whatsappPhoneDigits,
      totalUsersDisplay: settings.totalUsersDisplay,
      plansSectionTitle: settings.plansSectionTitle,
      plansSectionSubtitle: settings.plansSectionSubtitle,
    })
  }, [hydrated, settings, form])

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </div>
    )
  }

  function onSubmit(values: SettingsFormValues) {
    patchSettings({
      whatsappPhoneDigits: values.whatsappPhoneDigits.replace(/\D/g, ""),
      totalUsersDisplay: values.totalUsersDisplay,
      plansSectionTitle: values.plansSectionTitle.trim(),
      plansSectionSubtitle: values.plansSectionSubtitle.trim(),
    })
    toast.success("Settings saved")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Global knobs that affect both the admin overview and live storefront widgets.
        </p>
      </div>

      <Card className="border-border bg-card/70 p-6 backdrop-blur-xl">
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wa">WhatsApp phone (digits)</Label>
              <Input id="wa" {...form.register("whatsappPhoneDigits")} placeholder="97144310766" />
              <p className="text-xs text-muted-foreground">
                Used by the floating WhatsApp button and product CTAs that opt into redirects.
              </p>
              {form.formState.errors.whatsappPhoneDigits ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.whatsappPhoneDigits.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="users">Total users (display metric)</Label>
              <Input id="users" type="number" {...form.register("totalUsersDisplay")} />
              {form.formState.errors.totalUsersDisplay ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.totalUsersDisplay.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ptitle">Plans section title</Label>
            <Input id="ptitle" {...form.register("plansSectionTitle")} />
            {form.formState.errors.plansSectionTitle ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.plansSectionTitle.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="psub">Plans section subtitle</Label>
            <Textarea id="psub" rows={4} {...form.register("plansSectionSubtitle")} />
            {form.formState.errors.plansSectionSubtitle ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.plansSectionSubtitle.message}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save settings</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
