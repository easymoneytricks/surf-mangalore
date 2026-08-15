import { type ReactNode } from 'react'

import ContentHeader from './ContentHeader'
import ContentSidebar from './ContentSidebar'

type GenericEditorPageProps = {
  title: string
  description?: string
  actions?: ReactNode
  main: ReactNode
  sidebar?: ReactNode
}

export default function GenericEditorPage({ title, description, actions, main, sidebar }: GenericEditorPageProps) {
  return (
    <div className="space-y-5">
      <ContentHeader title={title} description={description} actions={actions} />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <div>{main}</div>
        {sidebar ? <ContentSidebar>{sidebar}</ContentSidebar> : null}
      </div>
    </div>
  )
}
