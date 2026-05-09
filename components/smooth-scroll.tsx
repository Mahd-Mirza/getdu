"use client"

import { useEffect, useCallback } from "react"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const handleAnchorClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const anchor = target.closest('a[href^="#"]')
    if (anchor) {
      const href = anchor.getAttribute("href")
      if (href && href !== "#") {
        e.preventDefault()
        const targetElement = document.querySelector(href)
        if (targetElement) {
          const navbarHeight = 80
          const elementPosition = targetElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.scrollY - navbarHeight
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener("click", handleAnchorClick)
    return () => {
      document.removeEventListener("click", handleAnchorClick)
    }
  }, [handleAnchorClick])

  return <>{children}</>
}
