import { type ReactNode } from 'react'

export default function SectionCard({ children }: { children: ReactNode }) {
  return <section className="admin-card rounded-2xl p-5">{children}</section>
}
