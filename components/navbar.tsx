"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, ChevronRight, Search, Wifi, Tv, Building2, SearchX } from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { useCMSStore } from "@/stores/cms-store"
import type { CMSProduct, PlanType } from "@/lib/cms/types"
import { NAVIGATE_TO_PLAN_EVENT, type NavigateToPlanDetail } from "@/components/plans"

const planTypeMeta: Record<PlanType, { label: string; icon: typeof Wifi }> = {
  internet: { label: "Internet Only", icon: Wifi },
  bundle: { label: "Internet + TV", icon: Tv },
  business: { label: "Corporate", icon: Building2 },
}

function scoreProduct(p: CMSProduct, q: string): number {
  if (!q) return 0
  const needle = q.toLowerCase().trim()
  if (!needle) return 0
  const name = p.name.toLowerCase()
  const desc = (p.description || "").toLowerCase()
  const feats = p.features.join(" ").toLowerCase()
  const plan = planTypeMeta[p.planType].label.toLowerCase()
  let score = 0
  if (name === needle) score += 100
  if (name.startsWith(needle)) score += 60
  if (name.includes(needle)) score += 40
  if (desc.includes(needle)) score += 18
  if (feats.includes(needle)) score += 10
  if (plan.includes(needle)) score += 8
  for (const word of needle.split(/\s+/).filter(Boolean)) {
    if (name.includes(word)) score += 6
    if (desc.includes(word)) score += 2
    if (feats.includes(word)) score += 1
  }
  return score
}

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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const products = useCMSStore((s) => s.products)

  const searchResults = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return [] as CMSProduct[]
    return products
      .map((p) => ({ p, s: scoreProduct(p, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((x) => x.p)
  }, [products, searchQuery])

  const hasQuery = searchQuery.trim().length > 0
  const hasResults = searchResults.length > 0

  const goToPlans = () => {
    setSearchOpen(false)
    setSearchQuery("")
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSelectResult = (p: CMSProduct) => {
    setSearchOpen(false)
    setIsMobileMenuOpen(false)
    setSearchQuery("")
    // Make sure the #plans section is in view first, then let Plans switch
    // tab and scroll precisely to the chosen card via the custom event.
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth", block: "start" })
    const detail: NavigateToPlanDetail = { id: p.id, planType: p.planType }
    window.requestAnimationFrame(() => {
      window.dispatchEvent(
        new CustomEvent<NavigateToPlanDetail>(NAVIGATE_TO_PLAN_EVENT, { detail }),
      )
    })
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!searchOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) setSearchQuery("")
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return
    const id = requestAnimationFrame(() => searchInputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [searchOpen])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        isScrolled
          ? "border-b border-[#00C2FF]/10 bg-[#071B2A]/92 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-[#00C2FF]/[0.12] bg-[#071B2A]/88 backdrop-blur-md"
      }`}
    >
      <div
        className="pointer-events-none hidden h-px w-full bg-gradient-to-r from-transparent via-[#00C2FF]/40 to-transparent md:block"
        aria-hidden
      />

      <div className="flex flex-col-reverse lg:contents">
      <div className="border-b border-white/[0.05] max-md:border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-0 py-0 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 md:py-4">
            {/* Strapline — theme cyan + muted labels */}
            <p className="order-2 max-md:flex max-md:flex-col max-md:gap-2.5 max-md:pt-1 max-md:leading-snug text-center md:order-1 md:block md:pt-0 md:text-left md:leading-normal">
              <span className="text-[16px] font-semibold leading-[1.35] text-[#00C2FF] [text-shadow:0_0_24px_rgba(0,194,255,0.22)] min-[375px]:text-[17px] sm:text-[18px] sm:leading-[1.3] md:inline md:text-base md:font-medium md:leading-snug md:[text-shadow:none]">
                <span className="text-[#00C2FF]/75 md:text-[#00C2FF]/60">&ldquo;</span>
                Services At Your Doorstep
                <span className="text-[#00C2FF]/75 md:text-[#00C2FF]/60">&rdquo;</span>
              </span>
            </p>

            <div className="order-1 flex justify-center md:order-2">
              <motion.a
                href="tel:80043838"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.995 }}
                className={`${phoneBtnClass} max-md:gap-0.5 max-md:px-2.5 max-md:py-px max-md:text-[10px] max-md:shadow-md max-md:ring-0`}
              >
                <span className="flex h-8 w-8 max-md:h-[18px] max-md:w-[18px] items-center justify-center rounded-full bg-black/20 ring-1 ring-white/15 max-md:ring-0">
                  <Phone className="h-4 w-4 max-md:h-2.5 max-md:w-2.5 text-white" strokeWidth={2} aria-hidden />
                </span>
                <span className="tabular-nums tracking-wide">800&nbsp;-&nbsp;43838</span>
              </motion.a>
            </div>

            <div className="order-3 flex flex-col items-center gap-0 md:flex-row md:justify-end md:gap-4">
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
                className={`${linkFocus} group relative inline-flex shrink-0 rounded-lg border border-[#00C2FF]/15 bg-white/[0.03] px-1.5 py-0 ring-1 ring-[#00C2FF]/12 transition-[border-color,box-shadow] hover:border-[#00C2FF]/35 hover:shadow-[0_0_28px_-10px_rgba(0,194,255,0.45)] max-md:ring-[#00C2FF]/08 md:rounded-xl md:px-4 md:py-3`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BrandLogo
                  priority
                  className="!h-7 !max-w-[min(100%,184px)] object-contain object-center sm:!h-9 sm:!max-w-[min(100%,240px)] md:!h-14 md:!max-w-[min(100%,340px)] md:object-right"
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
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSearchOpen((o) => !o)
              setIsMobileMenuOpen(false)
            }}
            className={`${linkFocus} ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#00C2FF]/20 bg-white/[0.05] text-white/80 shadow-[0_0_0_1px_rgba(0,194,255,0.06)] transition-[border-color,background-color,box-shadow,color] hover:border-[#00C2FF]/35 hover:bg-[#00C2FF]/[0.07] hover:text-[#00C2FF] hover:shadow-[0_0_20px_-8px_rgba(0,194,255,0.35)] ${searchOpen ? "border-[#00C2FF]/40 bg-[#00C2FF]/10 text-[#00C2FF]" : ""}`}
            aria-expanded={searchOpen}
            aria-controls="site-search-panel"
            aria-label={searchOpen ? "Close search" : "Open search"}
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
          </motion.button>
        </div>
      </nav>

      <nav
        aria-label="Primary"
        className="-mt-px border-t border-white/[0.05] lg:hidden max-md:-mt-0.5"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1.5 px-2.5 py-0 ps-[max(0.625rem,env(safe-area-inset-left))] pe-[max(0.625rem,env(safe-area-inset-right))] sm:gap-3 sm:px-6 sm:py-0">
          <Link
            href="#home"
            className={`${linkFocus} min-w-0 shrink-0 opacity-90 transition-opacity hover:opacity-100`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <BrandLogo
              priority={false}
              className="!h-5 !max-w-[min(100%,100px)] object-contain object-left sm:!h-[22px] sm:!max-w-[108px]"
            />
          </Link>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSearchOpen((o) => !o)
                setIsMobileMenuOpen(false)
              }}
              className={`${linkFocus} flex h-9 w-9 items-center justify-center rounded-lg border border-[#00C2FF]/20 bg-white/[0.05] text-white shadow-[0_0_0_1px_rgba(0,194,255,0.06)] transition-[border-color,background-color,box-shadow,color] hover:border-[#00C2FF]/35 hover:bg-[#00C2FF]/[0.07] hover:text-[#00C2FF] hover:shadow-[0_0_20px_-8px_rgba(0,194,255,0.35)] min-[375px]:h-10 min-[375px]:w-10 min-[375px]:rounded-xl sm:h-10 sm:w-10 ${searchOpen ? "border-[#00C2FF]/40 bg-[#00C2FF]/10 text-[#00C2FF]" : ""}`}
              aria-expanded={searchOpen}
              aria-controls="site-search-panel"
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              <Search className="h-[18px] w-[18px] min-[375px]:h-5 min-[375px]:w-5" strokeWidth={2} aria-hidden />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${linkFocus} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#00C2FF]/20 bg-white/[0.05] text-white shadow-[0_0_0_1px_rgba(0,194,255,0.06)] transition-[border-color,background-color,box-shadow] hover:border-[#00C2FF]/35 hover:bg-[#00C2FF]/[0.07] hover:shadow-[0_0_20px_-8px_rgba(0,194,255,0.35)] min-[375px]:h-10 min-[375px]:w-10 min-[375px]:rounded-xl sm:h-10 sm:w-10`}
              aria-expanded={isMobileMenuOpen}
              aria-controls={isMobileMenuOpen ? "mobile-primary-navigation" : undefined}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {searchOpen ? (
          <motion.div
            key="site-search-panel"
            id="site-search-panel"
            role="search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#00C2FF]/10 bg-[#061522]/80 backdrop-blur-md"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <label htmlFor="site-search-input" className="sr-only">
                Search site
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00C2FF]/50"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  ref={searchInputRef}
                  id="site-search-input"
                  type="text"
                  name="q"
                  placeholder="Search packages and services…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls="site-search-results"
                  className={`${linkFocus} w-full rounded-xl border border-[#00C2FF]/20 bg-white/[0.06] py-2.5 pl-10 pr-[8.5rem] text-sm text-white placeholder:text-white/35 ring-1 ring-[#00C2FF]/10 transition-[border-color,box-shadow] hover:border-[#00C2FF]/35 focus:border-[#00C2FF]/45 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/25 sm:pr-[9.5rem] sm:text-[15px] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (searchResults.length > 0) {
                        handleSelectResult(searchResults[0])
                      } else {
                        goToPlans()
                      }
                    }
                  }}
                />
                <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (searchResults.length > 0) {
                        handleSelectResult(searchResults[0])
                      } else {
                        goToPlans()
                      }
                    }}
                    className={`${linkFocus} inline-flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] px-3 text-[12px] font-semibold tracking-tight text-white shadow-[0_6px_18px_-6px_rgba(0,194,255,0.55)] ring-1 ring-white/10 transition-[box-shadow,transform] hover:shadow-[0_8px_22px_-6px_rgba(0,194,255,0.75)] sm:h-9 sm:px-4 sm:text-[13px]`}
                    aria-label="Search"
                  >
                    <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} aria-hidden />
                    <span>Search</span>
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className={`${linkFocus} flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white`}
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {hasQuery ? (
                  <motion.div
                    key="site-search-results"
                    id="site-search-results"
                    role="listbox"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-3 overflow-hidden rounded-2xl border border-[#00C2FF]/15 bg-[#071B2A]/95 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.04] backdrop-blur-xl"
                  >
                    {hasResults ? (
                      <>
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                          <span>
                            {searchResults.length} result{searchResults.length === 1 ? "" : "s"}
                          </span>
                          <span className="text-[#00C2FF]/60">Press Enter to open top match</span>
                        </div>
                        <ul className="max-h-[60vh] divide-y divide-white/[0.05] overflow-y-auto overscroll-contain">
                          {searchResults.map((p) => {
                            const PlanIcon = planTypeMeta[p.planType].icon
                            return (
                              <li key={p.id} role="option" aria-selected="false">
                                <button
                                  type="button"
                                  onClick={() => handleSelectResult(p)}
                                  className={`${linkFocus} group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04] sm:gap-4 sm:px-4 sm:py-3`}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={p.image}
                                    alt=""
                                    className="h-11 w-11 shrink-0 rounded-xl border border-white/10 object-cover sm:h-12 sm:w-12"
                                    onError={(e) => {
                                      e.currentTarget.src = "/logo.png"
                                    }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="truncate text-[14px] font-semibold text-white sm:text-[15px]">
                                        {p.name}
                                      </span>
                                      <span className="inline-flex items-center gap-1 rounded-full border border-[#00C2FF]/20 bg-[#00C2FF]/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#00C2FF]/85">
                                        <PlanIcon className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                                        {planTypeMeta[p.planType].label}
                                      </span>
                                    </div>
                                    {p.description ? (
                                      <p className="mt-0.5 truncate text-[12px] text-white/55 sm:text-[13px]">
                                        {p.description}
                                      </p>
                                    ) : null}
                                  </div>
                                  <div className="ml-2 hidden shrink-0 text-right sm:block">
                                    {p.hidePrice ? (
                                      <span className="text-[12px] font-medium text-white/55">
                                        On request
                                      </span>
                                    ) : (
                                      <>
                                        <div className="text-[14px] font-semibold text-white">
                                          AED {p.price}
                                        </div>
                                        <div className="text-[10px] text-white/40">
                                          {p.pricePeriod ?? "/month"}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <ChevronRight
                                    className="h-4 w-4 shrink-0 text-white/25 transition-colors group-hover:text-[#00C2FF]/80"
                                    strokeWidth={2}
                                    aria-hidden
                                  />
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55">
                          <SearchX className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">
                            No matches for &ldquo;{searchQuery.trim()}&rdquo;
                          </p>
                          <p className="mt-0.5 text-[12px] text-white/55">
                            Try a different keyword like <span className="text-[#00C2FF]/85">Internet</span>,{" "}
                            <span className="text-[#00C2FF]/85">TV</span>, or{" "}
                            <span className="text-[#00C2FF]/85">Business</span>.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {isMobileMenuOpen ? (
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] cursor-default bg-[#020812]/70 backdrop-blur-md lg:hidden"
            aria-hidden
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : null}
        {isMobileMenuOpen ? (
          <motion.aside
            key="mobile-nav-drawer"
            id="mobile-primary-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            initial={{ x: "-104%" }}
            animate={{ x: 0 }}
            exit={{ x: "-104%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 z-[61] flex h-[100dvh] w-[min(100%,min(20rem,92vw))] flex-col border-r border-[#00C2FF]/15 bg-[#061522]/98 shadow-[16px_0_48px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#061522]/92 lg:hidden"
            style={{
              paddingTop: "max(0.75rem, env(safe-area-inset-top))",
              paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
              paddingLeft: "max(1rem, env(safe-area-inset-left))",
              paddingRight: "max(1rem, env(safe-area-inset-right))",
            }}
          >
            <div className="pointer-events-none mb-5 h-px w-full shrink-0 bg-gradient-to-r from-[#00C2FF]/50 via-[#7c3aed]/35 to-transparent" aria-hidden />

            <div className="flex shrink-0 items-center justify-between gap-3 pb-1">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00C2FF]/55">
                  Menu
                </p>
                <p className="mt-0.5 text-sm font-medium text-white/90">Where to next?</p>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${linkFocus} flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/90 shadow-inner shadow-black/20 transition-[border-color,background-color] hover:border-[#00C2FF]/35 hover:bg-[#00C2FF]/10`}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </motion.button>
            </div>

            <nav
              className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] py-2"
              aria-label="Mobile primary"
            >
              <ul className="space-y-1.5">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.06 + index * 0.045,
                      duration: 0.32,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`${linkFocus} group flex items-center justify-between gap-3 rounded-xl border border-transparent bg-white/[0.02] px-3.5 py-3 text-[15px] font-medium text-white/85 shadow-sm shadow-black/5 transition-[border-color,background-color,color,transform] duration-200 hover:border-[#00C2FF]/20 hover:bg-[#00C2FF]/[0.08] hover:text-[#00C2FF] active:scale-[0.99] sm:px-4 sm:py-3.5`}
                    >
                      <span className="min-w-0">{link.name}</span>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-white/25 transition-colors duration-200 group-hover:text-[#00C2FF]/80"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="mt-4 shrink-0 border-t border-white/[0.07] pt-4">
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-white/45"
              >
                Call us anytime
              </motion.p>
              <motion.a
                href="tel:80043838"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`${phoneBtnClass} flex w-full justify-center rounded-full py-3.5 shadow-lg`}
              >
                <Phone className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                <span className="tabular-nums">800&nbsp;-&nbsp;43838</span>
              </motion.a>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
