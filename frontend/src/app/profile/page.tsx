import * as React from "react"
import { PageContainer, SectionContainer, ContentWrapper } from "@/components/layout/layout-primitives"
import { RouteCard } from "@/components/ui/route-card"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Ticket, Award, TrainFront, Activity, Leaf } from "lucide-react"

export default function ProfilePage() {
  return (
    <PageContainer>
      {/* Compact Personal Hero */}
      <SectionContainer className="pt-6 pb-8 bg-neutral-0 border-b border-neutral-200">
        <ContentWrapper size="md" className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="h-24 w-24 rounded-full bg-night-100 flex items-center justify-center text-night-700 text-h2 font-display overflow-hidden">
            <span aria-hidden="true">JD</span>
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-display-lg text-night-900 font-bold">Jamie Doe</h1>
            <p className="text-body-md text-neutral-600">Global Supporter • Fan ID: #104294</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
              <Badge variant="gold">Premium Fan</Badge>
              <Badge variant="neutral">Verified</Badge>
            </div>
          </div>
        </ContentWrapper>
      </SectionContainer>

      <SectionContainer className="py-8">
        <ContentWrapper size="md" className="space-y-8">
          
          {/* Ticket Summary */}
          <section aria-labelledby="tickets-heading">
            <h2 id="tickets-heading" className="text-h3 font-display font-semibold mb-4 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-neutral-600" />
              My Tickets
            </h2>
            <Card variant="standard">
              <CardContent className="p-0">
                <div className="divide-y divide-neutral-100">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-night-900">Group Stage: Match 12</p>
                      <p className="text-body-sm text-neutral-600">Stadium 1 • Tue, Jun 16 • Gate C</p>
                    </div>
                    <Badge variant="success">Upcoming</Badge>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-night-900">Quarter Final</p>
                      <p className="text-body-sm text-neutral-600">Stadium 3 • Sat, Jul 4 • Gate A</p>
                    </div>
                    <Badge variant="success">Upcoming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Saved Routes */}
          <section aria-labelledby="routes-heading">
            <h2 id="routes-heading" className="text-h3 font-display font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-neutral-600" />
              Saved Routes
            </h2>
            <div className="space-y-4">
              <RouteCard
                destination="Stadium 1 (Gate C)"
                eta="25 min"
                distance="4.2 km"
                transportMode={<><TrainFront className="h-4 w-4" /> Transit Line Blue</>}
                isAccessible={true}
                isSustainable={true}
                status="available"
              />
            </div>
          </section>

          {/* Achievements */}
          <section aria-labelledby="achievements-heading">
            <h2 id="achievements-heading" className="text-h3 font-display font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-neutral-600" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card variant="achievement" className="text-center p-4">
                <CardContent className="p-0 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mb-3">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-body-md font-semibold mb-1">Eco-Warrior</CardTitle>
                  <p className="text-[10px] text-neutral-600">Used public transit 5 times</p>
                </CardContent>
              </Card>
              
              <Card variant="standard" className="text-center p-4">
                <CardContent className="p-0 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mb-3">
                    <Activity className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-body-md font-semibold mb-1 text-neutral-600">Explorer</CardTitle>
                  <p className="text-[10px] text-neutral-600">Locked</p>
                </CardContent>
              </Card>
            </div>
          </section>

        </ContentWrapper>
      </SectionContainer>
    </PageContainer>
  )
}
