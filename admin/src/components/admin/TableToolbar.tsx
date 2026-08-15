import { type ReactNode } from 'react'

export default function TableToolbar({ children }: { children: ReactNode }) {
  return <div className="mb-3 flex flex-wrap items-center justify-between gap-2">{children}</div>
}
