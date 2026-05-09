"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, MapPin, Send, CheckCircle, MessageCircle, Clock, ArrowRight } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "Toll Free",
    value: "800 - 43838",
    link: "tel:80043838",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "customercare@getdu.ae",
    link: "mailto:customercare@getdu.ae",
  },
  {
    icon: MapPin,
    label: "Dubai Office",
    value: "+971 4 4310766",
    link: "tel:+97144310766",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Sun–Thu: 8AM – 6PM",
    link: "#contact",
  },
]

export function Contact() {
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

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.link}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 p-5 rounded-2xl glass-card hover:border-[#00C2FF]/40 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00C2FF]/20 to-[#7c3aed]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <info.icon className="w-6 h-6 text-[#00C2FF]" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">{info.label}</p>
                  <p className="text-white font-semibold">{info.value}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#00C2FF] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))}

            {/* WhatsApp Button */}
            <motion.a
              href="https://wa.me/97144310766"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-green-500 text-white font-semibold shadow-lg shadow-green-500/25"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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

              <div className="relative glass-card p-8 sm:p-10 rounded-3xl">
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
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="relative">
                          <label className="block text-white/70 text-sm font-medium mb-2">
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
                            className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-white/30 outline-none transition-all duration-300 ${
                              focusedField === "name"
                                ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                            placeholder="John Doe"
                          />
                        </div>

                        {/* Email */}
                        <div className="relative">
                          <label className="block text-white/70 text-sm font-medium mb-2">
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
                            className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-white/30 outline-none transition-all duration-300 ${
                              focusedField === "email"
                                ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div className="relative">
                          <label className="block text-white/70 text-sm font-medium mb-2">
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
                            className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-white/30 outline-none transition-all duration-300 ${
                              focusedField === "phone"
                                ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        {/* Service */}
                        <div className="relative">
                          <label className="block text-white/70 text-sm font-medium mb-2">
                            Interested In
                          </label>
                          <select
                            name="service"
                            value={formState.service}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("service")}
                            onBlur={() => setFocusedField(null)}
                            required
                            className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white outline-none transition-all duration-300 appearance-none cursor-pointer ${
                              focusedField === "service"
                                ? "border-[#00C2FF] shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <option value="" className="bg-[#071B2A]">Select a package</option>
                            <option value="home-tv-landline" className="bg-[#071B2A]">Internet + TV + Landline</option>
                            <option value="home-wireless" className="bg-[#071B2A]">Home Wireless 5G</option>
                            <option value="corporate" className="bg-[#071B2A]">Corporate / Business</option>
                            <option value="other" className="bg-[#071B2A]">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="relative">
                        <label className="block text-white/70 text-sm font-medium mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          rows={4}
                          className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-white/30 outline-none transition-all duration-300 resize-none ${
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
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#7c3aed] text-white font-semibold text-lg shadow-lg shadow-[#00C2FF]/25 hover:shadow-[#00C2FF]/40 transition-shadow"
                      >
                        <Send className="w-5 h-5" />
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
