import { Metadata } from 'next';
import { PageContainer, SectionContainer, ContentWrapper } from "@/components/layout/layout-primitives"
import dynamic from 'next/dynamic';
import { PageHeader } from "@/components/layout/page-header"

const VenueNavigationCard = dynamic(() => import('@/features/navigation/components/VenueNavigationCard'), {
  loading: () => <div className="h-64 w-full bg-neutral-50 animate-pulse rounded-lg border border-neutral-100" />
});
const TransportationCard = dynamic(() => import('@/features/navigation/components/TransportationCard'), {
  loading: () => <div className="h-64 w-full bg-neutral-50 animate-pulse rounded-lg border border-neutral-100" />
});
import { Map } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Smart Navigation | InfantinoOrg',
  description: 'AI-assisted venue navigation and transportation recommendations',
};

export default function NavigationPage() {
  return (
    <PageContainer>
      <SectionContainer className="pt-4 md:pt-8 pb-4">
        <ContentWrapper size="lg">
          <PageHeader 
            title="Smart Navigation"
            description="Seamlessly navigate FIFA World Cup 2026 venues and find the best way home."
            icon={Map}
            iconClassName="bg-semantic-success/15 text-semantic-success"
          />
        </ContentWrapper>
      </SectionContainer>
      
      <SectionContainer className="pb-12">
        <ContentWrapper size="lg">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <VenueNavigationCard />
            <TransportationCard />
          </div>
        </ContentWrapper>
      </SectionContainer>
    </PageContainer>
  );
}
