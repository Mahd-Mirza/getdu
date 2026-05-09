"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUp } from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"

const footerLinks = {
  Services: [
    { name: "Home Packages", href: "#plans" },
    { name: "Internet + TV + Landline", href: "#plans" },
    { name: "Internet Only (5G)", href: "#plans" },
    { name: "Corporate Packages", href: "#business" },
  ],
  Company: [
    { name: "About GetDu.ae", href: "#why-us" },
    { name: "Why Choose Us", href: "#why-us" },
    { name: "Our Process", href: "#process" },
    { name: "Contact", href: "#contact" },
  ],
  Support: [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#contact" },
    { name: "Service Status", href: "#" },
    { name: "FAQs", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Accessibility", href: "#" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribed(true)
    setTimeout(() => {
      setIsSubscribed(false)
      setEmail("")
    }, 3000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-[#050f18] overflow-hidden">
      {/* Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00C2FF]/50 to-transparent" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="#home" className="inline-flex items-center">
              <BrandLogo className="h-10 sm:h-11 max-w-[240px]" />
            </Link>
            <p className="text-white/50 leading-relaxed">
              With us you are always at the front of the queue. Get your TV and broadband at your doorstep with no extra charge — personalized telecom plans for homes and corporates across the UAE.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-white font-medium">Subscribe to our newsletter</p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-5 py-3 pr-14 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-[#00C2FF] transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] flex items-center justify-center"
                >
                  {isSubscribed ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white text-lg"
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-[#00C2FF] transition-colors inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-white/40 text-sm text-center md:text-left">
              © {new Date().getFullYear()} GetDu.ae · Authorized partner. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-[#00C2FF] hover:bg-[#00C2FF]/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Scroll to Top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00C2FF]/20 to-[#7c3aed]/20 flex items-center justify-center text-[#00C2FF] hover:from-[#00C2FF]/30 hover:to-[#7c3aed]/30 transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
