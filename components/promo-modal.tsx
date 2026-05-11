"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { BrandLogo } from "@/components/brand-logo"

/** Lifestyle visual — swap for `/promo-hero.jpg` in `public` anytime */
const PROMO_IMAGE =
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80"

type MiniPlanProps = {
  label?: string
  badge: string
  /** Tailwind classes for the top ribbon */
  badgeClassName: string
  was: number
  now: number
  detail: ReactNode
}

function MiniPlanCard({
  label,
  badge,
  badgeClassName,
  was,
  now,
  detail,
}: MiniPlanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#00C2FF]/20 bg-[#071B2A]/85 shadow-md shadow-[#00C2FF]/8 transition-[border-color,box-shadow] duration-300 hover:border-[#00C2FF]/35 hover:shadow-[#00C2FF]/12"
    >
      {/* Ribbon */}
      <div
        className={`px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white ${badgeClassName}`}
      >
        {badge}
      </div>

      <div className="relative flex flex-1 flex-col px-2.5 pb-2.5 pt-2">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00C2FF]/25 to-transparent"
          aria-hidden
        />

        <div className="mb-2 flex flex-col items-center gap-1">
          <BrandLogo
            className="!h-5 !max-w-[92px] object-contain opacity-95 transition-opacity group-hover:opacity-100"
            priority={false}
          />
          {label ? (
            <span className="rounded-full border border-[#00C2FF]/20 bg-[#00C2FF]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7ee8fd]">
              {label}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-0.5 border-t border-white/[0.06] pt-2.5 text-center">
          <span className="text-[9px] font-medium uppercase tracking-wider text-white/35">
            / mo + VAT
          </span>
          <p className="text-[11px] tabular-nums text-white/35 line-through">AED {was}</p>
          <p className="gradient-text text-lg font-bold tabular-nums leading-none tracking-tight sm:text-xl">
            AED {now}
          </p>
        </div>

        <div className="mt-2.5 rounded-lg bg-black/25 px-2.5 py-2 text-center text-[10px] leading-snug text-white/55 ring-1 ring-white/[0.05]">
          {detail}
        </div>
      </div>
    </motion.div>
  )
}

export function PromoModal() {
  const [open, setOpen] = useState(false)

  const dismiss = useCallback(() => {
    setOpen(false)
  }, [])

  /** Runs on every full page load / refresh (no sessionStorage — dismissed state resets). */
  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), 350)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(76vh,620px)] w-[calc(100vw-40px)] max-w-[calc(100vw-40px)] gap-0 overflow-hidden border-0 bg-transparent p-1 shadow-none sm:p-2 md:w-[46vw] md:max-w-[min(46vw,640px)]"
      >
        <div className="relative mx-auto max-h-[min(76vh,620px)] overflow-hidden rounded-3xl border border-[#00C2FF]/25 bg-[#071B2A] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]">
          <button
            type="button"
            onClick={dismiss}
            className="absolute -right-1 -top-1 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-500/90 bg-[#071B2A] text-red-500 shadow-lg transition hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071B2A] sm:right-2 sm:top-2"
            aria-label="Close promotion"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <div className="grid overflow-hidden rounded-3xl lg:max-h-[min(72vh,580px)] lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
            {/* Left — visual + CTA */}
            <div className="relative min-h-[155px] lg:min-h-[min(200px,26vh)]">
              <Image
                src={PROMO_IMAGE}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B2A] via-[#071B2A]/55 to-[#071B2A]/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071B2A]/80 to-transparent lg:to-[#071B2A]/10" />

              <div className="relative flex h-full min-h-[155px] flex-col justify-between p-3 sm:p-4 lg:min-h-[min(200px,26vh)] lg:py-4">
                <div>
                  <DialogTitle className="text-left text-base font-bold leading-tight text-white sm:text-lg lg:text-xl">
                    <span className="gradient-text">GetDu</span>{" "}
                    <span className="text-white">Fastest Internet Plans</span>
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 max-w-md text-left text-[11px] leading-snug text-white/65 sm:text-xs">
                    Limited-time doorstep offers — fiber & wireless 5G for home.
                  </DialogDescription>
                </div>

                <div className="mt-3 space-y-1.5 lg:mt-0">
                  <Link
                    href="#contact"
                    onClick={dismiss}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-[#00C2FF]/25 ring-1 ring-white/10 transition hover:shadow-[#00C2FF]/40 sm:text-sm"
                  >
                    Apply Now!
                  </Link>
                  <div className="rounded-lg border border-white/10 bg-black/45 px-2.5 py-1.5 text-center text-[10px] font-medium text-white/90 backdrop-blur-sm sm:text-[11px]">
                    Free Installation&nbsp;&nbsp;|&nbsp;&nbsp;Free &amp; Fast Home Delivery
                  </div>
                </div>
              </div>
            </div>

            {/* Right — plan cards */}
            <div className="flex min-h-0 flex-col justify-center overflow-hidden border-t border-[#00C2FF]/15 bg-gradient-to-b from-[#0a2540]/50 to-[#071B2A]/80 p-2.5 sm:p-3 lg:border-l lg:border-t-0">
              <div className="grid min-h-0 grid-cols-1 items-stretch gap-2 sm:grid-cols-2 sm:gap-2.5">
                <MiniPlanCard
                  label="Home"
                  badge="Fiber Cable"
                  badgeClassName="bg-gradient-to-r from-[#00C2FF] via-[#0099cc] to-[#7c3aed]"
                  was={429}
                  now={322}
                  detail={
                    <>
                      with <span className="font-semibold text-[#00C2FF]">25% discount</span> for
                      24 months
                    </>
                  }
                />
                <MiniPlanCard
                  label="Home"
                  badge="Wireless"
                  badgeClassName="bg-gradient-to-r from-[#00C2FF] via-[#0099cc] to-[#7c3aed]"
                  was={229}
                  now={160.3}
                  detail={
                    <span>
                      30% off — new customers (6 mo on Entertainment/Gaming, 3 mo on Plus) · unlimited 5G · 12 mo
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
