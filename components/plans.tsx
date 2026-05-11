"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Tv, Wifi, Zap, Star } from "lucide-react"
import type { PlanType } from "@/lib/cms/types"
import { getProductIcon } from "@/lib/cms/icons"
import { useCMSStore, whatsappHref } from "@/stores/cms-store"

export type NavigateToPlanDetail = { id: string; planType: PlanType }
export const NAVIGATE_TO_PLAN_EVENT = "navigate-to-plan"

const tabs: { id: PlanType; label: string; icon: typeof Wifi }[] = [
  { id: "internet", label: "Internet Only", icon: Wifi },
  { id: "bundle", label: "Internet + TV + Landline", icon: Tv },
]

export function Plans() {
  const [activeTab, setActiveTab] = useState<PlanType>("internet")
  const [highlightId, setHighlightId] = useState<string | null>(null)

  const products = useCMSStore((s) => s.products)
  const settings = useCMSStore((s) => s.settings)

  const filteredPlans = products.filter((plan) => plan.planType === activeTab)

  useEffect(() => {
    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent<NavigateToPlanDetail>).detail
      if (!detail?.id) return
      setActiveTab(detail.planType)
      setHighlightId(detail.id)
      // Wait for the tab switch + card render before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(`product-${detail.id}`)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" })
          } else {
            document
              .getElementById("plans")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        })
      })
      window.setTimeout(() => setHighlightId(null), 2200)
    }
    window.addEventListener(NAVIGATE_TO_PLAN_EVENT, onNavigate as EventListener)
    return () =>
      window.removeEventListener(NAVIGATE_TO_PLAN_EVENT, onNavigate as EventListener)
  }, [])

  return (
    <section id="plans" className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071B2A] via-[#0a2540] to-[#071B2A]" />
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#00C2FF]/10 blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#7c3aed]/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-4 text-center"
        >
          <h2 className="text-4xl font-bold text-white sm:text-5xl">{settings.plansSectionTitle}</h2>
          <p className="mx-auto max-w-2xl text-xl text-white/60">{settings.plansSectionSubtitle}</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex rounded-2xl border border-[#00C2FF]/20 glass p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-300 ${
                  activeTab === tab.id ? "text-[#071B2A]" : "text-white/70 hover:text-white"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#7c3aed]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {filteredPlans.map((plan, index) => {
            const Icon = getProductIcon(plan.iconKey)
            const wa = whatsappHref(
              settings.whatsappPhoneDigits,
              `Hi — I'm interested in ${plan.name}`,
            )
            const ctaHref = plan.whatsappRedirect ? wa : "#contact"

            const isHighlighted = highlightId === plan.id
            return (
              <motion.div
                key={plan.id}
                id={`product-${plan.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative group scroll-mt-32 ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""} ${
                  isHighlighted
                    ? "rounded-3xl ring-2 ring-[#00C2FF] ring-offset-4 ring-offset-[#0a2540] shadow-[0_0_60px_-10px_rgba(0,194,255,0.55)] transition-shadow duration-500"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 md:-top-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-[#00C2FF]/30 sm:px-4 sm:py-1.5 sm:text-sm"
                    >
                      <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                      Best Seller
                    </motion.div>
                  </div>
                )}

                <div
                  className={`relative h-full overflow-hidden rounded-2xl glass-card transition-all duration-300 sm:rounded-3xl ${
                    plan.popular ? "border-[#00C2FF]/40 shadow-lg shadow-[#00C2FF]/10" : ""
                  }`}
                >
                  <div
                    className="absolute right-0 top-0 h-24 w-24 rounded-full opacity-30 blur-[60px] transition-opacity group-hover:opacity-50 sm:h-32 sm:w-32 sm:blur-[80px]"
                    style={{ backgroundColor: plan.accentColor }}
                  />

                  <div className="relative space-y-3.5 p-3.5 sm:space-y-5 sm:p-5 md:space-y-6 md:p-8">
                    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
                      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={plan.image}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-xl border border-white/10 object-cover sm:h-11 sm:w-11 md:h-14 md:w-14 md:rounded-2xl"
                          onError={(e) => {
                            e.currentTarget.src = "/logo.png"
                          }}
                        />
                        <div
                          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:flex sm:h-11 sm:w-11 md:h-14 md:w-14 md:rounded-2xl"
                          style={{ backgroundColor: `${plan.accentColor}20` }}
                        >
                          <Icon
                            className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                            style={{ color: plan.accentColor }}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold leading-tight text-white sm:text-lg md:text-xl">
                          {plan.name}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/50 sm:text-xs md:text-sm">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {plan.stockStatus === "out_of_stock" ? (
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-red-300/90 sm:text-sm">
                          Out of stock
                        </p>
                      ) : plan.stockStatus === "low_stock" ? (
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-300/90 sm:text-xs">
                          Limited availability
                        </p>
                      ) : null}

                      {plan.hidePrice ? (
                        <p className="text-lg font-semibold text-white/75 sm:text-xl md:text-2xl">
                          Pricing on request
                        </p>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                            <span className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                              AED {plan.price}
                            </span>
                            <span className="text-[11px] text-white/50 sm:text-xs md:text-sm">
                              {plan.pricePeriod ?? "/month"}
                            </span>
                          </div>
                          {plan.originalPrice != null && (
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="text-[11px] text-white/40 line-through sm:text-sm">
                                AED {plan.originalPrice}/mo
                              </span>
                              {plan.originalPrice > plan.price && (
                                <span className="rounded-full bg-[#00C2FF]/20 px-1.5 py-0.5 text-[9px] font-medium text-[#00C2FF] sm:px-2 sm:text-xs">
                                  Save AED {plan.originalPrice - plan.price}
                                </span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-[12px] leading-snug text-white/70 sm:items-center sm:gap-2.5 sm:text-sm md:gap-3 md:text-base"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full sm:mt-0 sm:h-5 sm:w-5"
                            style={{ backgroundColor: `${plan.accentColor}30` }}
                          >
                            <Check
                              className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                              style={{ color: plan.accentColor }}
                            />
                          </motion.div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href={ctaHref}
                        target={plan.whatsappRedirect ? "_blank" : undefined}
                        rel={plan.whatsappRedirect ? "noopener noreferrer" : undefined}
                        className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-300 sm:gap-2 sm:rounded-xl sm:py-3 sm:text-sm md:py-4 md:text-lg ${
                          plan.popular
                            ? "bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] text-white shadow-lg shadow-[#00C2FF]/25"
                            : "border border-white/10 bg-white/5 text-white hover:border-[#00C2FF]/50 hover:bg-white/10"
                        }`}
                      >
                        <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        {plan.whatsappRedirect ? "WhatsApp us" : "Get Started"}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
