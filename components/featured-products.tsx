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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-[#00C2FF]/30">
                      <Star className="h-4 w-4" />
                      Best Seller
                    </div>
                  </div>
                ) : null}

                <div
                  className={`relative h-full overflow-hidden rounded-3xl glass-card transition-all duration-300 ${
                    plan.popular ? "border-[#00C2FF]/40 shadow-lg shadow-[#00C2FF]/10" : ""
                  }`}
                >
                  <div
                    className="absolute right-0 top-0 h-32 w-32 rounded-full opacity-30 blur-[70px] transition-opacity group-hover:opacity-45"
                    style={{ backgroundColor: plan.accentColor }}
                  />

                  <div className="relative space-y-6 p-8">
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={plan.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-2xl border border-white/10 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/logo.png"
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-sm text-white/50">{plan.description}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {plan.hidePrice ? (
                        <p className="text-lg font-semibold text-white/70">Pricing on request</p>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">AED {plan.price}</span>
                            <span className="text-sm text-white/50">{plan.pricePeriod ?? "/month"}</span>
                          </div>
                          {plan.originalPrice != null ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-white/40 line-through">
                                AED {plan.originalPrice}/mo
                              </span>
                              {plan.originalPrice > plan.price ? (
                                <span className="rounded-full bg-[#00C2FF]/20 px-2 py-0.5 text-xs font-medium text-[#00C2FF]">
                                  Save AED {plan.originalPrice - plan.price}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>

                    <ul className="space-y-3">
                      {plan.features.slice(0, 4).map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-white/70">
                          <div
                            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${plan.accentColor}30` }}
                          >
                            <Check className="h-3 w-3" style={{ color: plan.accentColor }} />
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
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-semibold transition-all duration-300 ${
                          plan.popular
                            ? "bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] text-white shadow-lg shadow-[#00C2FF]/25"
                            : "border border-white/10 bg-white/5 text-white hover:border-[#00C2FF]/50 hover:bg-white/10"
                        }`}
                      >
                        <Zap className="h-5 w-5" />
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
