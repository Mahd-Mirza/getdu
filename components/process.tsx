"use client"

import { motion } from "framer-motion"
import { Home, Phone, FileText, Wrench, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Home,
    title: "New home or office?",
    description: "Tell us what you need — we’ll recommend the right du home or business package.",
    color: "#00C2FF",
  },
  {
    number: "02",
    icon: Phone,
    title: "Request a callback from GetDu.ae",
    description: "Skip the queue — share your details and we’ll call you back at your convenience.",
    color: "#7c3aed",
  },
  {
    number: "03",
    icon: FileText,
    title: "Doorstep documentation",
    description: "Our agent visits you to complete paperwork — no extra charge for our service coordination.",
    color: "#14b8a6",
  },
  {
    number: "04",
    icon: Wrench,
    title: "Professional installation",
    description: "A qualified technician installs and activates your du connection.",
    color: "#00C2FF",
  },
]

export function Process() {
  return (
    <section id="process" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540] via-[#071B2A] to-[#0a2540]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Get Connected in{" "}
            <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Four simple steps from enquiry to live du broadband — service at your doorstep.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#00C2FF] via-[#7c3aed] to-[#00C2FF] origin-left"
              style={{
                boxShadow: "0 0 20px rgba(0, 194, 255, 0.5)",
              }}
            />
          </div>

          {/* Steps */}
          <div className="grid lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Card */}
                <div className="relative glass-card p-8 rounded-3xl text-center hover:border-[#00C2FF]/40 transition-all duration-300 group">
                  {/* Glow */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${step.color}10 0%, transparent 70%)`,
                    }}
                  />

                  {/* Step Number */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    <step.icon className="w-10 h-10" style={{ color: step.color }} />
                    
                    {/* Number Badge */}
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.number}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="relative z-10 text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="relative z-10 text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 z-10 -translate-y-1/2 translate-x-1/2">
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      className="w-8 h-8 rounded-full bg-[#071B2A] border-2 border-[#00C2FF] flex items-center justify-center"
                    >
                      <ArrowRight className="w-4 h-4 text-[#00C2FF]" />
                    </motion.div>
                  </div>
                )}

                {/* Mobile Connection Line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: 40 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      className="w-1 bg-gradient-to-b from-[#00C2FF] to-[#7c3aed] rounded-full"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] text-white font-semibold text-lg shadow-lg shadow-[#00C2FF]/25"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
