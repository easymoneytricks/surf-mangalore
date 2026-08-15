import { type ReactNode } from 'react'

type ActionBarProps = {
  children: ReactNode
}

export default function ActionBar({ children }: ActionBarProps) {
  return (
    <div className="admin-card mb-6 flex flex-wrap items-center gap-3 p-3 sm:p-4">
      {children}
    </div>
  )
}
