import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { DetailCard, PageHeader, SectionCard, SectionHeader, StatusBadge } from '../../components/admin'
import { galleryService } from '../../services/gallery.service'
import { type GalleryImageEntity } from '../../types/gallery'

export default function GalleryViewPage() {
  const { id } = useParams()
  const [item, setItem] = useState<GalleryImageEntity | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    galleryService
      .getById(Number(id))
      .then(setItem)
      .catch((fetchError: Error) => setError(fetchError.message))
  }, [id])

  if (error) {
    return <p className="text-sm text-rose-200">{error}</p>
  }

  if (!item) {
    return <p className="text-sm text-(--color-text-secondary)">Loading gallery image...</p>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.title}
        description={item.caption || 'Gallery image details'}
        actions={<Link className="text-sm text-(--color-primary)" to="/gallery">Back to Gallery</Link>}
      />

      <SectionCard>
        <SectionHeader title="Image Snapshot" actions={<StatusBadge tone={item.isFeatured ? 'positive' : 'neutral'} label={item.isFeatured ? 'Featured' : 'Standard'} />} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailCard title="Slug">{item.slug}</DetailCard>
          <DetailCard title="Album">{item.album?.name || '-'}</DetailCard>
          <DetailCard title="Photographer">{item.photographer || '-'}</DetailCard>
          <DetailCard title="Publish">{item.publishStatus}</DetailCard>
          <DetailCard title="Visibility">{item.visibility}</DetailCard>
          <DetailCard title="Status">{item.status}</DetailCard>
          <DetailCard title="Display Order">{item.displayOrder}</DetailCard>
          <DetailCard title="Tags">{item.tags.length ? item.tags.join(', ') : '-'}</DetailCard>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader title="Preview" />
        <img src={item.media.imageUrl} alt={item.altText || item.title} className="h-[26rem] w-full rounded-xl object-cover" loading="lazy" />
      </SectionCard>
    </div>
  )
}
