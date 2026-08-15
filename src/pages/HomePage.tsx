import HeroSection from '../components/home/HeroSection'
import TrustSection from '../components/home/TrustSection'
import LessonsPreview from '../components/home/LessonsPreview'
import WhyChooseUsSection from '../components/home/WhyChooseUsSection'
import GalleryPreview from '../components/home/GalleryPreview'
import EventsPreview from '../components/home/EventsPreview'
import CoachesPreview from '../components/home/CoachesPreview'
import TestimonialsPreview from '../components/home/TestimonialsPreview'
import FAQPreview from '../components/home/FAQPreview'
import BookingCTASection from '../components/home/BookingCTASection'

export default function HomePage() {
  return (
    <main className="w-full">
      <HeroSection />
      <TrustSection />
      <LessonsPreview />
      <WhyChooseUsSection />
      <GalleryPreview />
      <EventsPreview />
      <CoachesPreview />
      <TestimonialsPreview />
      <FAQPreview />
      <BookingCTASection />
    </main>
  )
}
