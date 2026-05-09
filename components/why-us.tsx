"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
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
    description: "Authorized partner delivering regulated du home and business plans with transparent promotions.",
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
    description: "Residential and corporate solutions for communities and business districts nationwide.",
    color: "#7c3aed",
  },
  {
    icon: Award,
    title: "No extra charge for coordination",
    description: "We don’t bill you for arranging doorstep visits or basic service coordination (T&C apply).",
    color: "#14b8a6",
  },
]

const stats = [
  { value: 13, suffix: "+ yrs", label: "Authorized partner experience", icon: Users },
  { value: 800, suffix: "", label: "Toll-free sales line", icon: Shield },
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
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
              <div className="p-6 rounded-3xl glass-card text-center hover:border-[#00C2FF]/40 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00C2FF]/20 to-[#7c3aed]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7 text-[#00C2FF]" />
                </div>
                
                {/* Value */}
                <p className="text-4xl font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                
                {/* Label */}
                <p className="text-white/60">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="relative p-8 rounded-3xl glass-card overflow-hidden hover:border-[#00C2FF]/40 transition-all duration-300">
                {/* Background Glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: feature.color }}
                />

                {/* Ripple Effect Container */}
                <div className="relative">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
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
