"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Wifi, Tv, Building2, Zap, Star } from "lucide-react"

type PlanType = "internet" | "bundle" | "business"

type Plan = {
  name: string
  icon: typeof Wifi
  type: PlanType
  price: number
  /** Monthly reference price before promo; omit strikethrough when null */
  originalPrice: number | null
  speed: string
  features: string[]
  popular: boolean
  color: string
  /** Shown next to the price (e.g. "/month + 5% VAT") */
  pricePeriod?: string
}

const plans: Plan[] = [
  // Internet + TV + Landline (home ultra bundles)
  {
    name: "Home Starter Ultra",
    icon: Tv,
    type: "bundle",
    price: 272,
    originalPrice: 389,
    speed: "250 Mbps download · 24-month offer",
    features: [
      "30% discount — 24-months offer",
      "24 months contract (+ fees & charges, T&C apply)",
      "Advanced WiFi router",
      "Free installation & no home deposit",
      "Light English Pack: 1 pack of your choice",
      "1 HDTV receiver",
    ],
    popular: false,
    color: "#14b8a6",
    pricePeriod: "/month + 5% VAT",
  },
  {
    name: "Home Basic Ultra",
    icon: Tv,
    type: "bundle",
    price: 322,
    originalPrice: 429,
    speed: "1 Gbps download · 24-month offer",
    features: [
      "25% discount for 24 months",
      "24 months contract (+ 5% VAT + fees & charges, T&C apply)",
      "Advanced WiFi router",
      "Free installation & no home deposit",
      "2 streaming services + 1 TV package",
      "1 recordable HDTV receiver · Disney+ included",
    ],
    popular: true,
    color: "#00C2FF",
    pricePeriod: "/month + 5% VAT",
  },
  {
    name: "Home Advanced Ultra",
    icon: Tv,
    type: "bundle",
    price: 434,
    originalPrice: 579,
    speed: "1 Gbps download · 24-month offer",
    features: [
      "25% discount for 24 months",
      "24 months contract (+ 5% VAT + fees & charges, T&C apply)",
      "2 premium WiFi routers",
      "Free installation & no home deposit",
      "3 streaming services + 2 TV packages",
      "1 recordable HDTV receiver · Disney+ included",
    ],
    popular: false,
    color: "#7c3aed",
    pricePeriod: "/month + 5% VAT",
  },
  {
    name: "Home Ultimate Ultra",
    icon: Tv,
    type: "bundle",
    price: 562,
    originalPrice: 749,
    speed: "1 Gbps download · 24-month offer",
    features: [
      "25% discount for 24 months",
      "24 months contract (+ 5% VAT + fees & charges, T&C apply)",
      "2 ultimate WiFi routers",
      "Free installation & no home deposit",
      "4 streaming services + 3 TV packages",
      "2 recordable HDTV receivers · Disney+ included",
    ],
    popular: false,
    color: "#00C2FF",
    pricePeriod: "/month + 5% VAT",
  },
  // Internet only — Home Wireless 5G
  {
    name: "Home Wireless 5G (Plan A)",
    icon: Wifi,
    type: "internet",
    price: 229,
    originalPrice: 299,
    speed: "Unlimited data · limited-time offer",
    features: [
      "20% discount for 12 months (was AED 299 + VAT)",
      "5G enabled router",
      "Unlimited data",
      "12 months contract",
    ],
    popular: false,
    color: "#14b8a6",
    pricePeriod: "/month + 5% VAT",
  },
  {
    name: "Home Wireless 5G (Plan B)",
    icon: Wifi,
    type: "internet",
    price: 299,
    originalPrice: 399,
    speed: "Unlimited data · limited-time offer",
    features: [
      "20% discount for 6 months (was AED 399 + VAT)",
      "Free router with latest WiFi 6 technology",
      "Unlimited data",
      "12 months contract",
      "Includes Amazon Prime, OSN+, Disney+, Botim (where applicable)",
    ],
    popular: true,
    color: "#00C2FF",
    pricePeriod: "/month + 5% VAT",
  },
  // Corporate — main + wireless
  {
    name: "Business Essential 100",
    icon: Building2,
    type: "business",
    price: 810,
    originalPrice: null,
    speed: "100 Mbps down / 10 Mbps up",
    features: [
      "One-time activation AED 200 + 5% VAT",
      "12 months contract",
      "Unlimited internet usage",
      "Dedicated account manager",
      "Flexible no-contract option at AED 1,200/month",
    ],
    popular: false,
    color: "#00C2FF",
    pricePeriod: "/month + 5% VAT",
  },
  {
    name: "Business Essential 150",
    icon: Building2,
    type: "business",
    price: 950,
    originalPrice: null,
    speed: "150 Mbps down / 15 Mbps up",
    features: [
      "One-time activation AED 200 + 5% VAT",
      "12 months contract",
      "Unlimited internet usage",
      "Dedicated account manager",
      "Flexible no-contract option at AED 1,400/month",
    ],
    popular: true,
    color: "#7c3aed",
    pricePeriod: "/month + 5% VAT",
  },
  {
    name: "Business Ultimate 200",
    icon: Building2,
    type: "business",
    price: 949,
    originalPrice: null,
    speed: "200 Mbps down / 40 Mbps up",
    features: [
      "Connectivity: static IP, internet power boost, 1 business line, 100 international mins",
      "Security: antivirus & bulk SMS",
      "Digital presence: 1 domain & e-commerce starter kit",
      "Productivity: 2× Microsoft 365 Business Basic licenses",
      "Monthly plan after 24 months: AED 1,249 (T&C apply)",
    ],
    popular: false,
    color: "#14b8a6",
    pricePeriod: "/month + 5% VAT",
  },
  {
    name: "Business Starter Pro (12 months)",
    icon: Building2,
    type: "business",
    price: 239,
    originalPrice: 299,
    speed: "Fixed broadband with 5G router",
    features: [
      "20% off limited offer",
      "Activation AED 200 + VAT",
      "Business landline",
      "Free e-commerce starter kit for 1 year",
    ],
    popular: false,
    color: "#00C2FF",
    pricePeriod: "/month + 5% VAT",
  },
  {
    name: "Business Starter Pro (24 months)",
    icon: Building2,
    type: "business",
    price: 249,
    originalPrice: 299,
    speed: "Fixed broadband with 5G router",
    features: [
      "Promotional monthly rate on 24-month term",
      "Activation AED 200 + VAT",
      "5G internet router",
      "Free digital starter kit for 1 year",
    ],
    popular: false,
    color: "#7c3aed",
    pricePeriod: "/month + 5% VAT",
  },
]

const tabs = [
  { id: "internet", label: "Internet Only", icon: Wifi },
  { id: "bundle", label: "Internet + TV + Landline", icon: Tv },
  { id: "business", label: "Corporate Packages", icon: Building2 },
]

export function Plans() {
  const [activeTab, setActiveTab] = useState("internet")

  const filteredPlans = plans.filter((plan) => plan.type === activeTab)

  return (
    <section id="plans" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071B2A] via-[#0a2540] to-[#071B2A]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C2FF]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Home &{" "}
            <span className="gradient-text">Corporate Packages</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Authorized partner offers for home and business — pricing shown includes promotional terms where noted (+ 5% VAT). Fees & charges may apply (T&C).
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1.5 rounded-2xl glass border border-[#00C2FF]/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-[#071B2A]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className="relative z-10 w-5 h-5" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative group ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] text-white text-sm font-semibold shadow-lg shadow-[#00C2FF]/30"
                  >
                    <Star className="w-4 h-4" />
                    Best Seller
                  </motion.div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative h-full p-8 rounded-3xl glass-card overflow-hidden transition-all duration-300 ${
                  plan.popular
                    ? "border-[#00C2FF]/40 shadow-lg shadow-[#00C2FF]/10"
                    : ""
                }`}
              >
                {/* Glow Effect */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity"
                  style={{ backgroundColor: plan.color }}
                />

                {/* Content */}
                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <plan.icon className="w-7 h-7" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-white/50 text-sm">{plan.speed}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-4xl font-bold text-white">AED {plan.price}</span>
                      <span className="text-white/50 text-sm">{plan.pricePeriod ?? "/month"}</span>
                    </div>
                    {plan.originalPrice != null && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white/40 line-through">
                          AED {plan.originalPrice}/mo
                        </span>
                        {plan.originalPrice > plan.price && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#00C2FF]/20 text-[#00C2FF]">
                            Save AED {plan.originalPrice - plan.price}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-white/70">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${plan.color}30` }}
                        >
                          <Check className="w-3 h-3" style={{ color: plan.color }} />
                        </motion.div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] text-white shadow-lg shadow-[#00C2FF]/25"
                        : "bg-white/5 text-white border border-white/10 hover:border-[#00C2FF]/50 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Get Started
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
