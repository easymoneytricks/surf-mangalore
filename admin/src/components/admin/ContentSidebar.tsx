import { type ReactNode } from 'react'

export default function ContentSidebar({ children }: { children: ReactNode }) {
  return <aside className="space-y-4">{children}</aside>
}
