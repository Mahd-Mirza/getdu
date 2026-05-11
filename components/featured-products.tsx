"use client"

import { motion } from "framer-motion"
import { Check, Star, Zap } from "lucide-react"
import Link from "next/link"
import { useCMSStore, whatsappHref } from "@/stores/cms-store"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"

export function FeaturedProducts() {
  const hydrated = usePersistHydrated(useCMSStore((s) => s._hasHydrated))
  const featured = useCMSStore((s) => s.featured)
  const products = useCMSStore((s) => s.products)
  const digits = useCMSStore((s) => s.settings.whatsappPhoneDigits)

  if (!hydrated) return null

  const rows = featured.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  if (rows.length === 0) return null

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#071B2A] via-[#0a2540]/45 to-[#071B2A]" />
      <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-[#00C2FF]/10 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#7c3aed]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 space-y-3 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C2FF]/25 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#00C2FF]/75">
            <Star className="h-3.5 w-3.5" />
            Featured
          </div>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            <span className="gradient-text">{featured.sectionTitle}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">{featured.sectionSubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-8 lg:grid-cols-3">
          {rows.map((plan, index) => {
            const wa = whatsappHref(digits, `Hi — I'm interested in ${plan.name}`)
            const ctaHref = plan.whatsappRedirect ? wa : "#contact"

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={{ y: -8 }}
                className={`relative group ${plan.popular ? "lg:-mt-3 lg:mb-3" : ""}`}
              >
                {plan.popular ? (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 md:-top-4">
                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-[#00C2FF]/30 sm:px-4 sm:py-1.5 sm:text-sm">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                      Best Seller
                    </div>
                  </div>
                ) : null}

                <div
                  className={`relative h-full overflow-hidden rounded-2xl glass-card transition-all duration-300 sm:rounded-3xl ${
                    plan.popular ? "border-[#00C2FF]/40 shadow-lg shadow-[#00C2FF]/10" : ""
                  }`}
                >
                  <div
                    className="absolute right-0 top-0 h-24 w-24 rounded-full opacity-30 blur-[60px] transition-opacity group-hover:opacity-45 sm:h-32 sm:w-32 sm:blur-[70px]"
                    style={{ backgroundColor: plan.accentColor }}
                  />

                  <div className="relative space-y-3.5 p-3.5 sm:space-y-5 sm:p-5 md:space-y-6 md:p-8">
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={plan.image}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-xl border border-white/10 object-cover sm:h-11 sm:w-11 md:h-14 md:w-14 md:rounded-2xl"
                        onError={(e) => {
                          e.currentTarget.src = "/logo.png"
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-bold leading-tight text-white sm:text-lg md:text-xl">
                          {plan.name}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/50 sm:text-xs md:text-sm">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {plan.hidePrice ? (
                        <p className="text-[11px] font-semibold text-white/70 sm:text-lg md:text-xl">
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
                          {plan.originalPrice != null ? (
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="text-[11px] text-white/40 line-through sm:text-sm">
                                AED {plan.originalPrice}/mo
                              </span>
                              {plan.originalPrice > plan.price ? (
                                <span className="rounded-full bg-[#00C2FF]/20 px-1.5 py-0.5 text-[9px] font-medium text-[#00C2FF] sm:px-2 sm:text-xs">
                                  Save AED {plan.originalPrice - plan.price}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>

                    <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
                      {plan.features.slice(0, 4).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-[12px] leading-snug text-white/70 sm:items-center sm:gap-2.5 sm:text-sm md:gap-3 md:text-base"
                        >
                          <div
                            className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full sm:mt-0 sm:h-5 sm:w-5"
                            style={{ backgroundColor: `${plan.accentColor}30` }}
                          >
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" style={{ color: plan.accentColor }} />
                          </div>
                          <span className="line-clamp-2">{feature}</span>
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
