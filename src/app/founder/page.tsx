import { FounderHeroSection } from '@/components/sections/FounderHeroSection'
import { FounderJourneySection } from '@/components/sections/FounderJourneySection'
import { FounderImpactSection } from '@/components/sections/FounderImpactSection'
import { FounderTribeSection } from '@/components/sections/FounderTribeSection'
import { JoinSalVisionSection } from '@/components/sections/JoinSalVisionSection'

export default function FounderPage() {
  return (
    <main className="min-h-screen">
      <FounderHeroSection />
      <FounderJourneySection />
      <FounderImpactSection />
      <FounderTribeSection />
      <JoinSalVisionSection />
    </main>
  )
}
