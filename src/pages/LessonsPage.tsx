import LessonsHero from '../components/lessons/LessonsHero'
import LessonCategories from '../components/lessons/LessonCategories'
import LessonDetailCards from '../components/lessons/LessonDetailCards'
import LearningProcess from '../components/lessons/LearningProcess'
import InstructorTrust from '../components/lessons/InstructorTrust'
import SafetySection from '../components/lessons/SafetySection'
import LessonFAQ from '../components/lessons/LessonFAQ'
import LessonsBookingCTA from '../components/lessons/LessonsBookingCTA'

export default function LessonsPage() {
  return (
    <main className="w-full">
      <LessonsHero />
      <LessonCategories />
      <LessonDetailCards />
      <LearningProcess />
      <InstructorTrust />
      <SafetySection />
      <LessonFAQ />
      <LessonsBookingCTA />
    </main>
  )
}
