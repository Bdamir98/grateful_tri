import { ImpactStatsSection } from '@/components/sections/ImpactStatsSection'
import { FeaturedProjectsSection } from '@/components/sections/FeaturedProjectsSection'

export default function WorkPage() {
  return (
    <main className="min-h-screen pt-20">
      <ImpactStatsSection />
      <FeaturedProjectsSection />
    </main>
  )
}
