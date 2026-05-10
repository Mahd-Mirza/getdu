"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { CmsServerSync } from "@/components/cms-server-sync"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <CmsServerSync />
      {children}
      <Toaster richColors position="top-center" closeButton />
    </ThemeProvider>
  )
}
