import { type ReactNode } from 'react'

export default function ActionToolbar({ children }: { children: ReactNode }) {
  return <div className="admin-card flex flex-wrap items-center gap-2 rounded-2xl p-3">{children}</div>
}
