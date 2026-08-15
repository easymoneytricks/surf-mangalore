import {
  EmptyState,
  LoadingState,
  PageHeader,
  SectionCard,
  SectionHeader,
} from '../components/admin'

type ModulePlaceholderPageProps = {
  title: string
}

export default function ModulePlaceholderPage({ title }: ModulePlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={`The ${title} module shell is ready. Data, workflows, and CRUD will be implemented in later sprints without changing layout foundation.`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard>
          <SectionHeader title="Loading Framework" subtitle="Consistent skeleton treatment for list, card, and form surfaces." />
          <LoadingState mode="table" />
        </SectionCard>

        <EmptyState
          title="Module foundations are ready"
          description="This section intentionally avoids CRUD and backend integration in Sprint 4. Future feature modules can attach to shared layout and reusable components without structural rewrites."
        />
      </div>
    </div>
  )
}
