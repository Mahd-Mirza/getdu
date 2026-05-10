"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Moon, Sun } from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { AdminSidebar, LogoutNavItem } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    toast.success("Signed out")
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 hidden bg-[radial-gradient(ellipse_at_top,_rgba(0,194,255,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(124,58,237,0.10),_transparent_50%)] dark:block" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.10),_transparent_55%)] dark:hidden" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-card/40 px-5 py-8 backdrop-blur-xl lg:flex lg:flex-col">
          <AdminSidebar />
          <div className="mt-4 border-t border-border pt-4">
            <LogoutNavItem onLogout={handleLogout} />
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="lg:hidden"
                      aria-label="Open navigation"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[min(100%,320px)] border-border bg-background p-0"
                  >
                    <SheetHeader className="border-b border-border px-5 py-4 text-left">
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="flex h-[calc(100vh-88px)] flex-col px-5 py-6">
                      <AdminSidebar onNavigate={() => setMobileOpen(false)} />
                      <div className="mt-auto border-t border-border pt-4">
                        <LogoutNavItem
                          onLogout={handleLogout}
                          onNavigate={() => setMobileOpen(false)}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
                    Control center
                  </p>
                  <p className="truncate text-lg font-semibold">Admin Dashboard</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  <Sun className="size-5 dark:hidden" />
                  <Moon className="hidden size-5 dark:inline" />
                </Button>
                <Button asChild variant="outline" className="hidden sm:inline-flex">
                  <Link href="/">View site</Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn("mx-auto w-full max-w-6xl")}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
