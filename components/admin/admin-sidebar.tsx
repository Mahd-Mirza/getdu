"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Boxes,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/featured", label: "Featured Products", icon: Sparkles },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full flex-col gap-6", className)}>
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00C2FF] to-[#7c3aed] shadow-lg shadow-[#00C2FF]/20">
          <Boxes className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">GetDu CMS</p>
          <p className="truncate text-xs text-muted-foreground">Admin workspace</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = item.end
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-foreground shadow-inner shadow-black/10"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-primary/80",
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        Tip: changes sync instantly to the marketing site via shared browser storage.
      </div> */}
    </div>
  )
}

export function LogoutNavItem({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void
  onNavigate?: () => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onLogout()
        onNavigate?.()
      }}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
    >
      <LogOut className="h-5 w-5 shrink-0" />
      Logout
    </button>
  )
}
