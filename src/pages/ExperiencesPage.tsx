import ExperienceHero from '../components/experiences/ExperienceHero'
import ExperienceCategories from '../components/experiences/ExperienceCategories'
import ExperienceComparison from '../components/experiences/ExperienceComparison'
import WhatYouWillLearn from '../components/experiences/WhatYouWillLearn'
import SafetyAndSupport from '../components/experiences/SafetyAndSupport'
import EquipmentSection from '../components/experiences/EquipmentSection'
import InstructorSection from '../components/experiences/InstructorSection'
import ExperienceFAQ from '../components/experiences/ExperienceFAQ'
import ExperienceCTA from '../components/experiences/ExperienceCTA'

export default function ExperiencesPage() {
  return (
    <main className="w-full">
      <ExperienceHero />
      <ExperienceCategories />
      <ExperienceComparison />
      <WhatYouWillLearn />
      <SafetyAndSupport />
      <EquipmentSection />
      <InstructorSection />
      <ExperienceFAQ />
      <ExperienceCTA />
    </main>
  )
}
