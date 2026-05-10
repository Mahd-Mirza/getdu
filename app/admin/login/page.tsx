"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Boxes } from "lucide-react"
import type { z } from "zod"
import { loginSchema } from "@/lib/cms/schemas"
import { ADMIN_EMAIL, useAuthStore } from "@/stores/auth-store"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

type LoginValues = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const authed = useAuthStore((s) => s.isAuthenticated)
  const hydrated = usePersistHydrated(useAuthStore((s) => s._hasHydrated))

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    if (!hydrated) return
    if (authed) router.replace("/admin")
  }, [hydrated, authed, router])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-10 text-primary" />
      </div>
    )
  }

  if (authed) return null

  async function onSubmit(values: LoginValues) {
    const ok = login(values.email, values.password)
    if (!ok) {
      toast.error("Invalid email or password")
      return
    }
    toast.success("Welcome back")
    router.replace("/admin")
    router.refresh()
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 hidden bg-[radial-gradient(ellipse_at_top,_rgba(0,194,255,0.14),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(124,58,237,0.12),_transparent_55%)] dark:block" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-14 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00C2FF] to-[#7c3aed] shadow-lg shadow-[#00C2FF]/20">
                <Boxes className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">GetDu CMS</p>
                <p className="text-xs text-muted-foreground">Secure admin access</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to site</Link>
            </Button>
          </div>

          <Card className="border-border bg-card/80 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
              {/* <p className="text-sm text-muted-foreground">
                Use the demo administrator account ({ADMIN_EMAIL}).
              </p> */}
            </div>

            <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email ? (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...form.register("password")}
                />
                {form.formState.errors.password ? (
                  <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                ) : null}
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Continue to dashboard
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Protected area — unauthorized access is blocked client-side (demo).
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
