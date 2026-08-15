import { type ReactNode } from 'react'

import ContentHeader from './ContentHeader'

type GenericListPageProps = {
  title: string
  description?: string
  actions?: ReactNode
  filters?: ReactNode
  bulkActions?: ReactNode
  children: ReactNode
}

export default function GenericListPage({ title, description, actions, filters, bulkActions, children }: GenericListPageProps) {
  return (
    <div className="space-y-5">
      <ContentHeader title={title} description={description} actions={actions} />
      {filters}
      {bulkActions}
      {children}
    </div>
  )
}
