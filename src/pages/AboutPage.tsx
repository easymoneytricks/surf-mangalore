import AboutHero from '../components/about/AboutHero'
import OurStory from '../components/about/OurStory'
import OurMission from '../components/about/OurMission'
import OurValues from '../components/about/OurValues'
import WhyMangalore from '../components/about/WhyMangalore'
import MeetTheCoaches from '../components/about/MeetTheCoaches'
import SafetyCommitment from '../components/about/SafetyCommitment'
import Timeline from '../components/about/Timeline'
import StatisticsSection from '../components/about/StatisticsSection'
import CommunitySection from '../components/about/CommunitySection'
import AboutCTA from '../components/about/AboutCTA'

export default function AboutPage() {
  return (
    <main className="w-full">
      <AboutHero />
      <OurStory />
      <OurMission />
      <OurValues />
      <WhyMangalore />
      <MeetTheCoaches />
      <SafetyCommitment />
      <Timeline />
      <StatisticsSection />
      <CommunitySection />
      <AboutCTA />
    </main>
  )
}
