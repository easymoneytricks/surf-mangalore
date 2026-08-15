import ContactHero from '../components/contact/ContactHero'
import ContactOptions from '../components/contact/ContactOptions'
import ContactForm from '../components/contact/ContactForm'
import LocationSection from '../components/contact/LocationSection'
import BusinessHours from '../components/contact/BusinessHours'
import FAQPreview from '../components/contact/FAQPreview'
import SocialConnect from '../components/contact/SocialConnect'
import ContactCTA from '../components/contact/ContactCTA'

export default function ContactPage() {
  return (
    <main className="w-full">
      <ContactHero />
      <ContactOptions />
      <ContactForm />
      <LocationSection />
      <BusinessHours />
      <FAQPreview />
      <SocialConnect />
      <ContactCTA />
    </main>
  )
}
