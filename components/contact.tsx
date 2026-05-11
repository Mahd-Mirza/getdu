"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, Send, CheckCircle, MessageCircle, Clock, ArrowRight } from "lucide-react"
import { useCMSStore, whatsappHref } from "@/stores/cms-store"

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+971 56 365 6816",
    link: "whatsapp",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "mirzaw525@gmail.com",
    link: "mailto:mirzaw525@gmail.com",
  },
  {
    icon: Clock,
    label: "Availability",
    value: "24 / 7 — every day",
    link: "#contact",
  },
]

export function Contact() {
  const whatsappDigits = useCMSStore((s) => s.settings.whatsappPhoneDigits)
  const whatsappChatHref = whatsappHref(whatsappDigits)

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormState({ name: "", email: "", phone: "", service: "", message: "" })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071B2A] via-[#0a2540] to-[#071B2A]" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#00C2FF]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#00C2FF]/30">
            <MessageCircle className="w-4 h-4 text-[#00C2FF]" />
            <span className="text-sm text-[#00C2FF] font-medium">Get in Touch</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Request a{" "}
            <span className="gradient-text">Callback</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Request a callback — our representative can visit you at a convenient date, time, and location at no charge.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 md:gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-2 lg:grid-cols-1 lg:gap-6"
          >
            {contactInfo.map((info, index) => {
              const href = info.link === "whatsapp" ? whatsappChatHref : info.link
              const isExternal = href.startsWith("https://")

              return (
                <motion.a
                  key={info.label}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="group flex flex-col gap-2 rounded-2xl glass-card p-3.5 transition-all duration-300 hover:border-[#00C2FF]/40 sm:flex-row sm:items-center sm:gap-4 sm:p-5 lg:gap-4"
                >
                  <div className="flex shrink-0 items-center gap-2 sm:contents">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00C2FF]/20 to-[#7c3aed]/20 transition-transform group-hover:scale-110 sm:h-12 sm:w-12 md:h-14 md:w-14">
                      <info.icon className="h-5 w-5 text-[#00C2FF] sm:h-6 sm:w-6" />
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#00C2FF] opacity-0 transition-opacity group-hover:opacity-100 sm:hidden" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-white/50 sm:text-sm">{info.label}</p>
                    <p className="text-[13px] font-semibold leading-snug text-white sm:text-base">{info.value}</p>
                  </div>
                  <ArrowRight className="ml-auto hidden h-5 w-5 shrink-0 text-[#00C2FF] opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
                </motion.a>
              )
            })}

            {/* WhatsApp Button */}
            <motion.a
              href={whatsappChatHref}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25 sm:gap-3 sm:py-4 sm:text-base lg:col-span-1"
            >
              <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </motion.a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00C2FF]/10 to-[#7c3aed]/10 rounded-3xl blur-2xl" />

              <div className="relative rounded-2xl glass-card p-4 sm:rounded-3xl sm:p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                      >
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                      <p className="text-white/60">We&apos;ll get back to you within 24 hours.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-3 sm:gap-6">
                        {/* Name */}
                        <div className="relative">
                          <label className="mb-1.5 block text-[11px] font-medium text-white/70 sm:mb-2 sm:text-sm">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            required
                            className={`w-full rounded-xl border bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-all duration-300 sm:px-5 sm:py-4 sm:text-base ${
                              focusedField === "name"
                                ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                            placeholder="John Doe"
                          />
                        </div>

                        {/* Email */}
                        <div className="relative">
                          <label className="mb-1.5 block text-[11px] font-medium text-white/70 sm:mb-2 sm:text-sm">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            required
                            className={`w-full rounded-xl border bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-all duration-300 sm:px-5 sm:py-4 sm:text-base ${
                              focusedField === "email"
                                ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-6">
                        {/* Phone */}
                        <div className="relative">
                          <label className="mb-1.5 block text-[11px] font-medium text-white/70 sm:mb-2 sm:text-sm">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formState.phone}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("phone")}
                            onBlur={() => setFocusedField(null)}
                            required
                            className={`w-full rounded-xl border bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-all duration-300 sm:px-5 sm:py-4 sm:text-base ${
                              focusedField === "phone"
                                ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        {/* Service */}
                        <div className="relative">
                          <label className="mb-1.5 block text-[11px] font-medium text-white/70 sm:mb-2 sm:text-sm">
                            Interested In
                          </label>
                          <select
                            name="service"
                            value={formState.service}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("service")}
                            onBlur={() => setFocusedField(null)}
                            required
                            className={`w-full cursor-pointer appearance-none rounded-xl border bg-white/5 px-3 py-3 text-sm text-white outline-none transition-all duration-300 sm:px-5 sm:py-4 sm:text-base ${
                              focusedField === "service"
                                ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <option value="" className="bg-[#071B2A]">Select a package</option>
                            <option value="home-tv-landline" className="bg-[#071B2A]">Internet + TV + Landline</option>
                            <option value="home-wireless" className="bg-[#071B2A]">Home Wireless 5G</option>
                            <option value="other" className="bg-[#071B2A]">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="relative">
                        <label className="mb-1.5 block text-[11px] font-medium text-white/70 sm:mb-2 sm:text-sm">
                          Message (Optional)
                        </label>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          rows={4}
                          className={`w-full resize-none rounded-xl border bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-all duration-300 sm:px-5 sm:py-4 sm:text-base ${
                            focusedField === "message"
                              ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                              : "border-white/10 hover:border-white/20"
                          }`}
                          placeholder="Tell us about your needs..."
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] py-3 text-sm font-semibold text-white shadow-lg shadow-[#00C2FF]/25 transition-shadow hover:shadow-[#00C2FF]/40 sm:gap-3 sm:py-4 sm:text-lg"
                      >
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                        Request Callback
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
