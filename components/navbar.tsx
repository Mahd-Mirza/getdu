"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone } from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#why-us" },
  { name: "Home Packages", href: "#plans" },
  { name: "Corporate Packages", href: "#business" },
  { name: "Contact Us", href: "#contact" },
]

const linkFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2FF]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071B2A] rounded-sm"

/** Matches hero / site CTAs: cyan → purple gradient */
const phoneBtnClass = `${linkFocus} inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-lg shadow-[#00C2FF]/25 ring-1 ring-white/10 transition-[box-shadow,transform] hover:shadow-[#00C2FF]/40 sm:px-6 sm:text-[15px]`

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        isScrolled
          ? "border-b border-[#00C2FF]/10 bg-[#071B2A]/92 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-[#00C2FF]/[0.12] bg-[#071B2A]/88 backdrop-blur-md"
      }`}
    >
      <div
        className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-[#00C2FF]/40 to-transparent"
        aria-hidden
      />

      <div className="border-b border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 md:py-4">
            {/* Strapline — theme cyan + muted labels */}
            <p className="order-2 text-center md:order-1 md:text-left">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00C2FF]/55 md:inline md:mb-0 md:mr-3 md:block md:text-left">
                UAE · Residential & Business
              </span>
              <span className="text-[15px] font-medium leading-snug text-[#00C2FF] sm:text-base md:inline">
                <span className="text-[#00C2FF]/60">&ldquo;</span>
                Services At Your Doorstep
                <span className="text-[#00C2FF]/60">&rdquo;</span>
              </span>
            </p>

            <div className="order-1 flex justify-center md:order-2">
              <motion.a
                href="tel:80043838"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.995 }}
                className={phoneBtnClass}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 ring-1 ring-white/15">
                  <Phone className="h-4 w-4 text-white" strokeWidth={2} aria-hidden />
                </span>
                <span className="tabular-nums tracking-wide">800&nbsp;-&nbsp;43838</span>
              </motion.a>
            </div>

            <div className="order-3 flex flex-col items-center gap-2 md:flex-row md:justify-end md:gap-4">
              <div className="hidden text-right sm:block">
                <p
                  className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#00C2FF]/45"
                  dir="rtl"
                >
                  شريك معتمد
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#00C2FF]/45">
                  Authorised partner
                </p>
              </div>
              <Link
                href="#home"
                className={`${linkFocus} group relative inline-flex shrink-0 rounded-xl border border-[#00C2FF]/15 bg-white/[0.03] px-4 py-3 ring-1 ring-[#00C2FF]/12 transition-[border-color,box-shadow] hover:border-[#00C2FF]/35 hover:shadow-[0_0_28px_-10px_rgba(0,194,255,0.45)]`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BrandLogo
                  priority
                  className="!h-12 !max-w-[min(100%,300px)] object-contain object-center sm:!h-14 sm:!max-w-[min(100%,340px)] md:object-right"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav
        className="mx-auto hidden max-w-7xl px-4 sm:px-6 lg:block lg:px-8"
        aria-label="Primary"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${linkFocus} group relative px-4 py-2 text-[13px] font-medium text-white/65 transition-colors hover:text-[#00C2FF] lg:text-sm`}
            >
              {link.name}
              <span
                className="pointer-events-none absolute bottom-1 left-4 right-4 h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3 lg:hidden">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00C2FF]/40">
          Navigation
        </span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`${linkFocus} flex h-10 w-10 items-center justify-center rounded-lg border border-[#00C2FF]/15 bg-white/[0.04] text-white transition-colors hover:border-[#00C2FF]/30 hover:bg-[#00C2FF]/5`}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#00C2FF]/10 bg-[#050f18]/97 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-0.5 px-3 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${linkFocus} block rounded-lg px-4 py-3.5 text-[15px] font-medium text-white/80 transition-colors hover:bg-[#00C2FF]/10 hover:text-[#00C2FF]`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="mx-1 my-4 h-px bg-[#00C2FF]/10" aria-hidden />
              <motion.a
                href="tel:80043838"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className={`${phoneBtnClass} mb-1 w-full justify-center rounded-full py-3.5`}
              >
                <Phone className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="tabular-nums">800&nbsp;-&nbsp;43838</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
