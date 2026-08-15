import { type ReactNode } from 'react'

export default function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[90rem] space-y-6 px-1 pb-8 sm:px-2">{children}</div>
}
