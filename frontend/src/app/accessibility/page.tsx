import { Metadata } from 'next';
import { PageContainer, SectionContainer, ContentWrapper } from "@/components/layout/layout-primitives"
import { PageHeader } from "@/components/layout/page-header"
import { AssistantCard } from '@/features/accessibility/components/AssistantCard';
import { AccessibleRouteCard } from '@/features/accessibility/components/AccessibleRouteCard';
import { VisionCard } from '@/features/accessibility/components/VisionCard';
import { TranslationCard } from '@/features/accessibility/components/TranslationCard';
import { Accessibility } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessibility & Assistance | InfantinoOrg',
  description: 'Multilingual AI assistance and accessible navigation',
};

export default function AccessibilityPage() {
  return (
    <PageContainer>
      <SectionContainer className="pt-4 md:pt-8 pb-4">
        <ContentWrapper size="lg">
          <PageHeader 
            title="Accessibility & Assistance"
            description="Inclusive venue navigation, multilingual translation, and ambient AI assistance."
            icon={Accessibility}
            iconClassName="bg-purple-100 text-purple-700"
          />
        </ContentWrapper>
      </SectionContainer>
      
      <SectionContainer className="pb-12">
        <ContentWrapper size="lg">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <AssistantCard />
            <AccessibleRouteCard />
            <VisionCard />
            <TranslationCard />
          </div>
        </ContentWrapper>
      </SectionContainer>
    </PageContainer>
  );
}
