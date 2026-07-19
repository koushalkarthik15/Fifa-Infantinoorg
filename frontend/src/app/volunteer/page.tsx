import React from 'react';
import { PageContainer, SectionContainer, ContentWrapper } from "@/components/layout/layout-primitives"
import { PageHeader } from "@/components/layout/page-header"
import { IncidentReportCard } from '@/features/volunteer/components/IncidentReportCard';
import { HeartHandshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function VolunteerAIPage() {
  return (
    <PageContainer>
      <SectionContainer className="pt-4 md:pt-8 pb-4">
        <ContentWrapper size="lg">
          <PageHeader 
            title="Volunteer AI Command"
            description="Intelligent incident categorization and dynamic volunteer assignment to ensure rapid response across FIFA World Cup 2026 venues."
            icon={HeartHandshake}
            iconClassName="bg-night-800 text-night-200"
            badge={<Badge variant="gold">On Duty</Badge>}
          />
        </ContentWrapper>
      </SectionContainer>

      <SectionContainer className="pb-12">
        <ContentWrapper size="lg">
          <div className="grid grid-cols-1 gap-6">
            <IncidentReportCard />
          </div>
        </ContentWrapper>
      </SectionContainer>
    </PageContainer>
  );
}
