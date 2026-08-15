import { useState } from 'react'

import { type MediaEntity } from '../../types/media'
import MediaPickerModal from './MediaPickerModal'
import SecondaryButton from './SecondaryButton'

type MediaSelectorPlaceholderProps = {
  onSelect?: (items: MediaEntity[]) => void
  allowMultiple?: boolean
}

export default function MediaSelectorPlaceholder({ onSelect, allowMultiple = false }: MediaSelectorPlaceholderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)

  const handleSelect = (items: MediaEntity[]) => {
    setSelectedCount(items.length)
    onSelect?.(items)
  }

  return (
    <>
      <section className="admin-card rounded-2xl border border-dashed border-white/20 p-4">
        <h3 className="text-sm font-semibold text-(--color-text)">Media Selector</h3>
        <p className="mt-2 text-sm text-(--color-text-secondary)">
          Select reusable assets from central media library instead of direct uploads.
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <SecondaryButton onClick={() => setIsOpen(true)}>{allowMultiple ? 'Select Media' : 'Select Image'}</SecondaryButton>
          <span className="text-xs text-(--color-text-secondary)">{selectedCount ? `${selectedCount} selected` : 'No media selected'}</span>
        </div>
      </section>

      <MediaPickerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
        allowMultiple={allowMultiple}
      />
    </>
  )
}
