import { PageContainer } from "@/components/layout/layout-primitives"
import { Spinner } from "@/components/ui/loading"

export default function GlobalLoading() {
  return (
    <PageContainer className="flex items-center justify-center min-h-[50vh] motion-reduce:transition-none">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-pitch-500" />
        <p className="text-body-md text-neutral-500 font-medium animate-pulse">Loading...</p>
      </div>
    </PageContainer>
  )
}
