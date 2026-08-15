import { useEffect, useMemo, useState } from 'react'

import { mediaService } from '../../services/media.service'
import { type MediaEntity } from '../../types/media'
import PrimaryButton from './PrimaryButton'
import SearchBar from './SearchBar'
import SecondaryButton from './SecondaryButton'
import SelectInput from './form/SelectInput'
import Modal from './modal/Modal'

type MediaPickerModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (items: MediaEntity[]) => void
  allowMultiple?: boolean
  title?: string
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  allowMultiple = false,
  title = 'Media Library Picker',
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaEntity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('all')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const folderOptions = useMemo(() => {
    const folders = new Set(items.map((item) => item.folder))
    return [{ label: 'All Folders', value: 'all' }, ...Array.from(folders).map((item) => ({ label: item, value: item }))]
  }, [items])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setLoading(true)
    setError(null)

    mediaService
      .list({
        page: 1,
        pageSize: 30,
        search,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        filters: {
          folder: folder === 'all' ? undefined : folder,
        },
      })
      .then((response) => {
        setItems(response.items)
      })
      .catch((fetchError: Error) => {
        setError(fetchError.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [isOpen, search, folder])

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      if (!allowMultiple) {
        return prev.includes(id) ? [] : [id]
      }

      return prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    })
  }

  const handleConfirm = () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id))
    onSelect(selectedItems)
    onClose()
    setSelectedIds([])
  }

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={(
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={handleConfirm} disabled={!selectedIds.length}>Select {selectedIds.length || ''}</PrimaryButton>
        </div>
      )}
    >
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <SearchBar value={search} onChange={setSearch} placeholder="Search media" />
          <SelectInput label="Folder" value={folder} onChange={setFolder} options={folderOptions} />
        </div>

        {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
        {loading ? <p className="text-sm text-(--color-text-secondary)">Loading media...</p> : null}

        <div className="grid max-h-[52vh] grid-cols-2 gap-3 overflow-y-auto rounded-xl border border-white/10 p-2 sm:grid-cols-3">
          {items.map((item) => {
            const active = selectedIds.includes(item.id)

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggle(item.id)}
                className={`overflow-hidden rounded-xl border text-left transition ${active ? 'border-(--color-primary) ring-2 ring-(--color-primary)/40' : 'border-white/10 hover:border-white/25'}`}
              >
                <img src={item.thumbnailUrl || item.filePath} alt={item.altText || item.title} className="h-28 w-full object-cover" loading="lazy" />
                <div className="space-y-1 p-2">
                  <p className="line-clamp-1 text-xs font-semibold text-(--color-text)">{item.title}</p>
                  <p className="line-clamp-1 text-[11px] text-(--color-text-secondary)">{item.folder}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
