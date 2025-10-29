import { AboutSection } from '@/components/sections/AboutSection'
import { MissionSection } from '@/components/sections/MissionSection'
import { VisionSection } from '@/components/sections/VisionSection'
import { ImpactApproachSection } from '@/components/sections/ImpactApproachSection'
import { JoinMissionSection } from '@/components/sections/JoinMissionSection'

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20">
      <AboutSection />
      <MissionSection />
      <VisionSection />
      <ImpactApproachSection />
      <JoinMissionSection />
    </main>
  )
}
