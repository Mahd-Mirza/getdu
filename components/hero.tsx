"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Play, Zap, Shield, Clock } from "lucide-react"

/** Same on server and client — avoids hydration mismatch from Math.random(). */
function stable01(seed: number): number {
  const x = Math.imul(seed ^ 0xdeadbeef, 2654435761) >>> 0
  return x / 4294967296
}

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-40 lg:pt-36"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071B2A] via-[#0a2540] to-[#071B2A]" />
        
        {/* Animated Blobs */}
        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00C2FF]/20 rounded-full blur-[100px] animate-blob"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#7c3aed]/20 rounded-full blur-[100px] animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#14b8a6]/10 rounded-full blur-[150px] animate-blob" style={{ animationDelay: "4s" }} />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00C2FF]/50 rounded-full"
            style={{
              left: `${stable01(i * 1000 + 1) * 100}%`,
              top: `${stable01(i * 1000 + 2) * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + stable01(i * 1000 + 3) * 2,
              repeat: Infinity,
              delay: stable01(i * 1000 + 4) * 2,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,194,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,194,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#00C2FF]/30"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C2FF]" />
              </span>
              <span className="text-sm text-[#00C2FF] font-medium">Services At Your Doorstep</span>
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                Home{" "}
                <span className="gradient-text">Internet</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl text-white/60 font-light"
              >
                25% discount for 24 months or 2 months free — router included.{" "}
                <span className="text-[#00C2FF]">Fiber</span> &{" "}
                <span className="text-[#7c3aed]">5G</span> plans for UAE homes and businesses.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6"
            >
              {[
                { icon: Zap, text: "Doorstep signup & installation" },
                { icon: Shield, text: "Authorized du partner" },
                { icon: Clock, text: "Dedicated customer care" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-white/70">
                  <feature.icon className="w-5 h-5 text-[#00C2FF]" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#plans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] text-white font-semibold text-lg overflow-hidden shadow-lg shadow-[#00C2FF]/25"
              >
                <span className="relative z-10">View Plans</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#00C2FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full glass border border-[#00C2FF]/30 text-white font-semibold text-lg hover:border-[#00C2FF]/60 transition-colors"
              >
                <Play className="w-5 h-5 text-[#00C2FF]" />
                Get Connected
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Router */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotateY: [0, 5, 0],
                rotateX: [0, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                x: mousePosition.x,
                y: mousePosition.y,
                perspective: 1000,
              }}
              className="relative"
            >
              {/* Router Illustration */}
              <div className="relative w-80 h-80 mx-auto">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00C2FF]/30 to-[#7c3aed]/30 rounded-full blur-[60px]" />
                
                {/* Router Body */}
                <div className="absolute inset-8 glass-card flex items-center justify-center">
                  <div className="space-y-4 text-center">
                    {/* Router Icon */}
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#00C2FF] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#00C2FF]/30">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    
                    {/* Signal Indicators */}
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full bg-[#00C2FF]"
                        />
                      ))}
                    </div>
                    
                    {/* Speed Display */}
                    <div className="text-2xl font-bold text-white">
                      Up to{" "}
                      <span className="text-[#00C2FF]">1 Gbps</span>
                    </div>
                  </div>
                </div>

                {/* Orbiting Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00C2FF] shadow-lg shadow-[#00C2FF]/50" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4"
                >
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#7c3aed] shadow-lg shadow-[#7c3aed]/50" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#plans"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/50 hover:text-[#00C2FF] transition-colors"
        >
          <span className="text-sm">Scroll Down</span>
          <ChevronDown className="w-5 h-5" />
        </motion.a>
      </motion.div>
    </section>
  )
}
