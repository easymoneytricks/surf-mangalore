import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { DetailCard, PageHeader, SectionCard, SectionHeader, StatusBadge } from '../../components/admin'
import { coachesService } from '../../services/coaches.service'
import { type CoachEntity } from '../../types/coaches'
import { getPublicSiteBaseUrl } from '../../config/runtime'

const PUBLIC_SITE_BASE_URL = getPublicSiteBaseUrl()

export default function CoachViewPage() {
  const { id } = useParams()
  const [coach, setCoach] = useState<CoachEntity | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    coachesService
      .getById(Number(id))
      .then(setCoach)
      .catch((fetchError: Error) => setError(fetchError.message))
  }, [id])

  if (error) {
    return <p className="text-sm text-rose-200">{error}</p>
  }

  if (!coach) {
    return <p className="text-sm text-(--color-text-secondary)">Loading coach...</p>
  }

  const previewUrl = `${PUBLIC_SITE_BASE_URL}/coaches/${coach.slug}`

  return (
    <div className="space-y-6">
      <PageHeader
        title={coach.fullName}
        description={coach.shortBio || coach.jobTitle}
        actions={(
          <div className="flex items-center gap-3">
            <button type="button" className="text-sm text-(--color-primary)" onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}>Preview Public Page</button>
            <Link className="text-sm text-(--color-primary)" to="/coaches">Back to Coaches</Link>
          </div>
        )}
      />

      <SectionCard>
        <SectionHeader title="Coach Snapshot" actions={<StatusBadge tone={coach.isFeatured ? 'positive' : 'neutral'} label={coach.isFeatured ? 'Featured' : 'Standard'} />} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailCard title="Slug">{coach.slug}</DetailCard>
          <DetailCard title="Title">{coach.jobTitle}</DetailCard>
          <DetailCard title="Years of Experience">{coach.yearsOfExperience ?? '-'}</DetailCard>
          <DetailCard title="Publish">{coach.publishStatus}</DetailCard>
          <DetailCard title="Visibility">{coach.visibility}</DetailCard>
          <DetailCard title="Status">{coach.status}</DetailCard>
          <DetailCard title="Display Order">{coach.displayOrder}</DetailCard>
          <DetailCard title="Email">{coach.email || '-'}</DetailCard>
          <DetailCard title="Phone">{coach.phone || '-'}</DetailCard>
          <DetailCard title="Website">{coach.socialLinks.website || coach.website || '-'}</DetailCard>
          <DetailCard title="Specialization">{coach.specialization.length ? coach.specialization.join(', ') : '-'}</DetailCard>
          <DetailCard title="Languages">{coach.languages.length ? coach.languages.join(', ') : '-'}</DetailCard>
          <DetailCard title="Certifications">{coach.certifications.length ? coach.certifications.join(', ') : '-'}</DetailCard>
        </div>
      </SectionCard>

      {coach.profilePhotoUrl ? (
        <SectionCard>
          <SectionHeader title="Profile Photo" />
          <img src={coach.profilePhotoUrl} alt={coach.fullName} className="h-72 w-full rounded-xl object-cover" />
        </SectionCard>
      ) : null}

      {coach.coverPhotoUrl ? (
        <SectionCard>
          <SectionHeader title="Cover Photo" />
          <img src={coach.coverPhotoUrl} alt={`${coach.fullName} cover`} className="h-72 w-full rounded-xl object-cover" />
        </SectionCard>
      ) : null}

      {coach.fullBio ? (
        <SectionCard>
          <SectionHeader title="Full Bio" />
          <p className="text-sm leading-7 text-(--color-text-secondary)">{coach.fullBio}</p>
        </SectionCard>
      ) : null}
    </div>
  )
}
