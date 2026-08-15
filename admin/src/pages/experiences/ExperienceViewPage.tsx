import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { DetailCard, PageHeader, SectionCard, SectionHeader, StatusBadge } from '../../components/admin'
import { experiencesService } from '../../services/experiences.service'
import { type ExperienceEntity } from '../../types/experiences'

export default function ExperienceViewPage() {
  const { id } = useParams()
  const [experience, setExperience] = useState<ExperienceEntity | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    experiencesService
      .getById(Number(id))
      .then(setExperience)
      .catch((fetchError: Error) => setError(fetchError.message))
  }, [id])

  if (error) {
    return <p className="text-sm text-rose-200">{error}</p>
  }

  if (!experience) {
    return <p className="text-sm text-(--color-text-secondary)">Loading experience...</p>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={experience.title}
        description={experience.shortDescription || 'Experience details'}
        actions={<Link className="text-sm text-(--color-primary)" to="/experiences">Back to Experiences</Link>}
      />

      <SectionCard>
        <SectionHeader title="Experience Snapshot" actions={<StatusBadge tone={experience.isFeatured ? 'positive' : 'neutral'} label={experience.isFeatured ? 'Featured' : 'Standard'} />} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailCard title="Slug">{experience.slug}</DetailCard>
          <DetailCard title="Category">{experience.category || '-'}</DetailCard>
          <DetailCard title="Difficulty">{experience.difficulty}</DetailCard>
          <DetailCard title="Recommended Age">{experience.recommendedAge || '-'}</DetailCard>
          <DetailCard title="Duration">{experience.duration || '-'}</DetailCard>
          <DetailCard title="Participants">{experience.maxParticipants || '-'}</DetailCard>
          <DetailCard title="Base Price">{experience.basePrice ? `₹${experience.basePrice}` : '-'}</DetailCard>
          <DetailCard title="Discount Price">{experience.discountPrice ? `₹${experience.discountPrice}` : '-'}</DetailCard>
          <DetailCard title="Instructor">{experience.instructor || '-'}</DetailCard>
          <DetailCard title="Publish">{experience.publishStatus}</DetailCard>
          <DetailCard title="Visibility">{experience.visibility}</DetailCard>
          <DetailCard title="Status">{experience.status}</DetailCard>
          <DetailCard title="Display Order">{experience.displayOrder}</DetailCard>
          <DetailCard title="Linked Lessons">{experience.linkedLessonsCount}</DetailCard>
        </div>
      </SectionCard>

      {experience.linkedLessons.length ? (
        <SectionCard>
          <SectionHeader title="Linked Lessons" />
          <div className="grid gap-3 md:grid-cols-2">
            {experience.linkedLessons.map((lesson) => (
              <DetailCard key={lesson.id} title={lesson.title}>{lesson.difficulty} · {lesson.publishStatus}</DetailCard>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {experience.coverImageUrl ? (
        <SectionCard>
          <SectionHeader title="Cover Image" />
          <img src={experience.coverImageUrl} alt={experience.title} className="h-72 w-full rounded-xl object-cover" />
        </SectionCard>
      ) : null}
    </div>
  )
}
