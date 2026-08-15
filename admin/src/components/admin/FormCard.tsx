import { type ReactNode } from 'react'

export default function FormCard({ children }: { children: ReactNode }) {
  return <div className="admin-card rounded-2xl p-5">{children}</div>
}
