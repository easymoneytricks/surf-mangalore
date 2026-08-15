import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../Button'
import Card from '../Card'
import { type GalleryPublicItem } from '../../services/gallery.service'

type GalleryLightboxProps = {
  item: GalleryPublicItem | null
  onClose: () => void
}

export default function GalleryLightbox({ item, onClose }: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!item) {
      return
    }

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    queueMicrotask(() => {
      closeButtonRef.current?.focus()
    })

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      triggerRef.current?.focus()
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(4,19,27,0.82)] px-4 py-6 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Card variant="feature" className="overflow-hidden border-white/12 p-0 shadow-[0_40px_120px_rgba(4,19,27,0.5)]">
              <div className="relative aspect-[4/5] lg:aspect-[16/9]">
                <img src={item.imageUrl} alt={item.altText} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16))]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.04),rgba(4,19,27,0.88))]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[rgba(4,19,27,0.46)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-white backdrop-blur-lg">
                  {item.category}
                </div>
              </div>

              <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Gallery preview</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--color-text-secondary)]">{item.description}</p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <p className="text-sm text-[var(--color-text-secondary)]">Prepared for future high-resolution photography and drone captures.</p>
                  <Button ref={closeButtonRef} variant="outline" size="md" onClick={onClose}>
                    Close preview
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
