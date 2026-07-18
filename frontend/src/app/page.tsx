import { PageContainer, SectionContainer, ContentWrapper } from "@/components/layout/layout-primitives"
import { HeroBanner } from "@/components/ui/hero-banner"
import { FeatureCard } from "@/components/ui/feature-card"
import { AIRecommendationCard } from "@/components/ui/ai-recommendation-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Map, Accessibility, HeartHandshake, Leaf, CloudSun, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <PageContainer>
      <SectionContainer className="pt-4 md:pt-6">
        <ContentWrapper size="lg">
          <HeroBanner
            title="Ready for the Match?"
            subtitle="Explore host cities, find the best routes, and experience the tournament like never before."
            gradient="stadium-lights"
            primaryAction={
              <Link href="/profile" className="w-full block">
                <Button variant="primary" size="lg" className="w-full">
                  Profile
                </Button>
              </Link>
            }
            secondaryAction={
              <Link href="/settings" className="w-full block">
                <Button variant="secondary" size="lg" className="w-full bg-neutral-0/10 text-neutral-0 hover:bg-neutral-0/20 border-none">
                  Settings
                </Button>
              </Link>
            }
          />
        </ContentWrapper>
      </SectionContainer>

      {/* "Today at the Tournament" Static UI Composition */}
      <SectionContainer className="py-2">
        <ContentWrapper size="lg">
          <Card variant="standard" className="bg-neutral-50/50 border-neutral-100">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 overflow-x-auto w-full no-scrollbar whitespace-nowrap">
                <div className="flex items-center gap-2 text-body-sm font-medium text-neutral-600">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  World Cup Final
                </div>
                <div className="w-px h-4 bg-neutral-200 shrink-0" />
                <div className="flex items-center gap-2 text-body-sm font-medium text-neutral-600">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  MetLife Stadium, NJ
                </div>
                <div className="w-px h-4 bg-neutral-200 shrink-0" />
                <div className="flex items-center gap-2 text-body-sm font-medium text-neutral-600">
                  <CloudSun className="h-4 w-4 text-neutral-400" />
                  72°F / Partly Cloudy
                </div>
              </div>
            </CardContent>
          </Card>
        </ContentWrapper>
      </SectionContainer>

      <SectionContainer className="py-6">
        <ContentWrapper size="lg">
          <AIRecommendationCard
            title="Contextual Insight"
            recommendation="The World Cup Final at MetLife Stadium starts in 3 hours. Transit lines are showing moderate congestion. We suggest taking the NJ Transit Meadowlands Rail Service in 45 minutes to avoid peak crowds."
            actionLabel="View Route"
            actionHref="/navigation"
          />
        </ContentWrapper>
      </SectionContainer>

      <SectionContainer className="pb-12">
        <ContentWrapper size="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 font-display font-bold text-night-900">Tournament Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/crowd" className="rounded-lg block h-full">
              <FeatureCard
                title="Crowd Intelligence"
                description="Live heatmaps and flow predictions to help you navigate efficiently around stadiums and transit hubs."
                icon={Users}
                iconClassName="bg-semantic-info/10 text-semantic-info"
                interactive={true}
              />
            </Link>
            
            <Link href="/navigation" className="rounded-lg block h-full">
              <FeatureCard
                title="Smart Navigation"
                description="Turn-by-turn directions integrating live crowd data, public transit, and active travel options."
                icon={Map}
                iconClassName="bg-semantic-success/15 text-semantic-success"
                interactive={true}
              />
            </Link>
            
            <Link href="/accessibility" className="rounded-lg block h-full">
              <FeatureCard
                title="Accessibility Assistant"
                description="Find accessible routes, sensory rooms, and request volunteer assistance directly from your device."
                icon={Accessibility}
                iconClassName="bg-purple-100 text-purple-700"
                interactive={true}
              />
            </Link>
            
            <Link href="/volunteer" className="rounded-lg block h-full">
              <FeatureCard
                title="Volunteer Support"
                description="Tools for tournament volunteers to manage shifts, tasks, and report incidents."
                icon={HeartHandshake}
                iconClassName="bg-night-800 text-night-200"
                interactive={true}
              />
            </Link>
            
            <Link href="/sustainability" className="rounded-lg block h-full">
              <FeatureCard
                title="Sustainability Tracker"
                description="Track your eco-score, find recycling points, and make greener travel choices."
                icon={Leaf}
                iconClassName="bg-emerald-100 text-emerald-700"
                interactive={true}
              />
            </Link>
          </div>
        </ContentWrapper>
      </SectionContainer>
    </PageContainer>
  )
}
