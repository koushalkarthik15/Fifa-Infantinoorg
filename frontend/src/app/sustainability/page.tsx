import React from 'react';
import { PageContainer, SectionContainer, ContentWrapper } from "@/components/layout/layout-primitives"
import dynamic from 'next/dynamic';
import { PageHeader } from "@/components/layout/page-header"

const GreenTransportationCard = dynamic(() => import('@/features/sustainability/components/GreenTransportationCard'), {
  loading: () => <div className="h-64 w-full bg-neutral-50 animate-pulse rounded-lg border border-neutral-100" />
});
const FacilitiesCard = dynamic(() => import('@/features/sustainability/components/FacilitiesCard'), {
  loading: () => <div className="h-64 w-full bg-neutral-50 animate-pulse rounded-lg border border-neutral-100" />
});
import { Leaf } from 'lucide-react';

export default function SustainabilityPage() {
  return (
    <PageContainer>
      <SectionContainer className="pt-4 md:pt-8 pb-4">
        <ContentWrapper size="lg">
          <PageHeader 
            title="Sustainability Assistant"
            description="Make a positive impact! Find green transportation options, locate water refill stations, and discover nearby recycling points."
            icon={Leaf}
            iconClassName="bg-emerald-100 text-emerald-700"
          />
        </ContentWrapper>
      </SectionContainer>

      <SectionContainer className="pb-12">
        <ContentWrapper size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GreenTransportationCard />
            <FacilitiesCard />
          </div>
        </ContentWrapper>
      </SectionContainer>
    </PageContainer>
  );
}
