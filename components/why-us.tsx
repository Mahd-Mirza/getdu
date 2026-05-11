"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Zap, Shield, Clock, Users, Award, Headphones, Globe, Wifi } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Service at your doorstep",
    description: "Sign up, documentation, and coordination handled where you are — fewer trips and less hassle.",
    color: "#00C2FF",
  },
  {
    icon: Shield,
    title: "Trusted du channel partner",
    description: "Authorized partner delivering regulated du home plans with transparent promotions.",
    color: "#7c3aed",
  },
  {
    icon: Clock,
    title: "Professional team & support centre",
    description: "Experienced agents and a dedicated customer-care workflow for sales and after-sales queries.",
    color: "#14b8a6",
  },
  {
    icon: Headphones,
    title: "Promotions in selected areas",
    description: "Fiber, TV, landline, and 5G wireless offers vary by location — we’ll confirm eligibility with you.",
    color: "#00C2FF",
  },
  {
    icon: Globe,
    title: "Coverage across the UAE",
    description: "Residential connectivity for communities across the UAE nationwide.",
    color: "#7c3aed",
  },
  {
    icon: Award,
    title: "No extra charge for coordination",
    description: "We don’t bill you for arranging doorstep visits or basic service coordination (T&C apply).",
    color: "#14b8a6",
  },
]

const stats: Array<
  | { value: number; suffix: string; label: string; icon: LucideIcon }
  | { display: string; label: string; icon: LucideIcon }
> = [
  { value: 13, suffix: "+ yrs", label: "Authorized partner experience", icon: Users },
  { display: "+971563656816", label: "Sales hotline", icon: Shield },
  { value: 24, suffix: "/7", label: "Customer-care access", icon: Headphones },
  { value: 100, suffix: "%", label: "Doorstep-first coordination", icon: Globe },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function WhyUs() {
  return (
    <section id="why-us" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071B2A] via-[#0a2540] to-[#071B2A]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#00C2FF]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#7c3aed]/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#00C2FF]/30">
            <Wifi className="w-4 h-4 text-[#00C2FF]" />
            <span className="text-sm text-[#00C2FF] font-medium">Why Choose Us</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Why choose <span className="gradient-text">GetDu.ae</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Personalized telecom at your door — queue-less callbacks, professional field teams, and du-official packages tailored to homes and corporates.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="rounded-2xl glass-card p-3.5 text-center transition-all duration-300 hover:border-[#00C2FF]/40 sm:rounded-3xl sm:p-5 md:p-6">
                {/* Icon */}
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00C2FF]/20 to-[#7c3aed]/20 transition-transform group-hover:scale-110 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14">
                  <stat.icon className="h-5 w-5 text-[#00C2FF] sm:h-6 sm:w-6 md:h-7 md:w-7" />
                </div>

                {/* Value */}
                <p
                  className={`mb-1 font-bold text-white sm:mb-2 ${
                    "display" in stat
                      ? "break-all text-lg tabular-nums sm:text-2xl md:text-3xl"
                      : "text-2xl sm:text-3xl md:text-4xl"
                  }`}
                >
                  {"display" in stat ? stat.display : <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
                </p>

                {/* Label */}
                <p className="text-[11px] leading-snug text-white/60 sm:text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl glass-card p-3.5 transition-all duration-300 hover:border-[#00C2FF]/40 sm:rounded-3xl sm:p-5 md:p-8">
                {/* Background Glow */}
                <div
                  className="absolute right-0 top-0 h-20 w-20 rounded-full opacity-20 blur-[50px] transition-opacity group-hover:opacity-40 sm:h-28 sm:w-28 sm:blur-[70px] md:h-32 md:w-32 md:blur-[80px]"
                  style={{ backgroundColor: feature.color }}
                />

                {/* Ripple Effect Container */}
                <div className="relative">
                  {/* Icon */}
                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl md:mb-6 md:h-16 md:w-16"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon className="h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8" style={{ color: feature.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="mb-1.5 text-[14px] font-bold leading-tight text-white sm:mb-3 sm:text-lg md:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] leading-snug text-white/60 sm:text-sm sm:leading-relaxed md:text-base">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00C2FF] to-[#7c3aed]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
