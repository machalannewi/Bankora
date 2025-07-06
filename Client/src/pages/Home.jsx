import Navbar from "@/components/navbar/Navbar"
import Hero from "@/components/hero/Hero"
import Service from "@/components/our-service/Service"
import HowItWorks from "@/components/HIW/HowItWorks"
import Testimonial from "@/components/testimonial/Testimonial"
import SecuritySection from "@/components/security/SecuritySection"
import AppPreview from "@/components/app-preview/AppPreview"
import CallToAction from "@/components/cta/CallToAction"
import Footer from "@/components/footer/Footer"


export default function Home() {

  return (
    <>
    <Navbar />
    <Hero />
    <HowItWorks />
    <Service />
    <Testimonial />
    <SecuritySection />
    <AppPreview />
    <CallToAction />
    <Footer />

    </>

  )
}
