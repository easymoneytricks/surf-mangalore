import { type ReactNode } from 'react'

export default function FormActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4">{children}</div>
}
