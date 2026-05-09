"use client"

import { motion } from "framer-motion"
import { Building2, Shield, Headphones, Gauge, Cloud, Lock, TrendingUp, Users } from "lucide-react"

const features = [
  {
    icon: Gauge,
    title: "Scalable speeds",
    description: "100 Mbps to 200 Mbps business fibre with upload tiers to match your operations",
  },
  {
    icon: Shield,
    title: "Security & connectivity add-ons",
    description: "Static IP, power boost, antivirus, bulk SMS and international minute bundles on selected plans",
  },
  {
    icon: Cloud,
    title: "Digital starter kits",
    description: "Domain, e-commerce starter kit and productivity licenses available on Ultimate and wireless promos",
  },
  {
    icon: Headphones,
    title: "Account management",
    description: "Dedicated account manager and flexible term options where advertised",
  },
]

const stats = [
  { value: "200 Mbps", label: "Ultimate downlink" },
  { value: "40 Mbps", label: "Ultimate uplink" },
  { value: "12–24 mo", label: "Contract options" },
  { value: "800", label: "Sales toll-free" },
]

export function Business() {
  return (
    <section id="business" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540] via-[#071B2A] to-[#0a2540]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,194,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,194,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Dashboard */}
            <div className="relative glass-card p-6 rounded-3xl">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00C2FF]/20 to-[#7c3aed]/20 rounded-3xl blur-2xl" />
              
              <div className="relative space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C2FF] to-[#7c3aed] flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Business Dashboard</h4>
                      <p className="text-white/50 text-sm">Real-time analytics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Bandwidth Used", value: "847 GB", change: "+12%", color: "#00C2FF" },
                    { label: "Active Devices", value: "156", change: "+8", color: "#7c3aed" },
                    { label: "Uptime", value: "99.99%", change: "SLA Met", color: "#14b8a6" },
                    { label: "Avg Latency", value: "3.2ms", change: "-0.4ms", color: "#00C2FF" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/5"
                    >
                      <p className="text-white/50 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className="text-sm mt-1" style={{ color: stat.color }}>
                        {stat.change}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Graph Area */}
                <div className="h-32 rounded-xl bg-white/5 border border-white/5 p-4 overflow-hidden">
                  <div className="flex items-end justify-between h-full gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-[#00C2FF] to-[#7c3aed]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-6 -right-6 p-4 rounded-2xl glass border border-[#00C2FF]/30 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Performance</p>
                  <p className="text-green-400 text-sm">+24% this month</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 p-4 rounded-2xl glass border border-[#7c3aed]/30 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <div>
                  <p className="text-white font-semibold">Team Access</p>
                  <p className="text-[#7c3aed] text-sm">12 users online</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#00C2FF]/30">
                <Building2 className="w-4 h-4 text-[#00C2FF]" />
                <span className="text-sm text-[#00C2FF] font-medium">Enterprise Solutions</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Corporate{" "}
                <span className="gradient-text">Broadband & Landline</span>
              </h2>
              <p className="text-lg text-white/60">
                Business Essential and Ultimate plans with symmetric speeds, static IP options,
                Microsoft 365 add-ons, and wireless Business Starter Pro offers — activation and contract terms as published (T&C apply).
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00C2FF]/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00C2FF]/20 to-[#7c3aed]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-[#00C2FF]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold text-[#00C2FF]">{stat.value}</p>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] text-white font-semibold text-lg shadow-lg shadow-[#00C2FF]/25"
            >
              <Lock className="w-5 h-5" />
              Enquire — Corporate Packages
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
