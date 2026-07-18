import { Metadata } from 'next';
import { PageContainer, SectionContainer, ContentWrapper } from "@/components/layout/layout-primitives"
import dynamic from 'next/dynamic';
import { PageHeader } from "@/components/layout/page-header"

const HeatmapCard = dynamic(() => import('@/features/crowd-ai/components/HeatmapCard'), {
  loading: () => <div className="h-64 w-full bg-neutral-50 animate-pulse rounded-lg border border-neutral-100" />
});
import { PredictionCard } from '@/features/crowd-ai/components/PredictionCard';
import { RouteCard } from '@/features/crowd-ai/components/RouteCard';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Crowd AI | InfantinoOrg',
  description: 'AI-assisted crowd prediction and management for the FIFA World Cup 2026',
};

export default function CrowdPage() {
  return (
    <PageContainer>
      <SectionContainer className="pt-4 md:pt-8 pb-4">
        <ContentWrapper size="lg">
          <PageHeader 
            title="Crowd Intelligence"
            description="Visualize real-time stadium density and get AI-assisted route recommendations to avoid congestion."
            icon={Users}
            iconClassName="bg-semantic-info/10 text-semantic-info"
            badge={<Badge variant="info">Live</Badge>}
          />
        </ContentWrapper>
      </SectionContainer>
      
      <SectionContainer className="pb-12">
        <ContentWrapper size="lg">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <HeatmapCard />
            </div>
            <PredictionCard />
            <RouteCard />
          </div>
        </ContentWrapper>
      </SectionContainer>
    </PageContainer>
  );
}
