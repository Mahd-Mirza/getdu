import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Plans } from "@/components/plans"
import { WhyUs } from "@/components/why-us"
import { Process } from "@/components/process"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { ScrollProgress } from "@/components/scroll-progress"
import { PromoModal } from "@/components/promo-modal"
import { FeaturedProducts } from "@/components/featured-products"
import { CmsWhatsAppFab } from "@/components/cms-whatsapp-fab"

export default function Home() {
  return (
    <SmoothScroll>
      <PromoModal />
      <main className="relative min-h-screen bg-[#071B2A] overflow-hidden">
        {/* Scroll Progress Indicator */}
        <ScrollProgress />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Hero Section */}
        <Hero />

        <FeaturedProducts />
        
        {/* Pricing Plans */}
        <Plans />

        {/* Why Choose Us */}
        <WhyUs />
        
        {/* Process Timeline */}
        <Process />
        
        {/* Contact/Callback Form */}
        <Contact />
        
        {/* Footer */}
        <Footer />
        
        <CmsWhatsAppFab />
      </main>
    </SmoothScroll>
  )
}
