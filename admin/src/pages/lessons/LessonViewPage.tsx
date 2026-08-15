import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { DetailCard, PageHeader, SectionCard, SectionHeader, StatusBadge } from '../../components/admin'
import { lessonsService } from '../../services/lessons.service'
import { type LessonEntity } from '../../types/lessons'

export default function LessonViewPage() {
  const { id } = useParams()
  const [lesson, setLesson] = useState<LessonEntity | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    lessonsService
      .getById(Number(id))
      .then(setLesson)
      .catch((fetchError: Error) => setError(fetchError.message))
  }, [id])

  if (error) {
    return <p className="text-sm text-rose-200">{error}</p>
  }

  if (!lesson) {
    return <p className="text-sm text-(--color-text-secondary)">Loading lesson...</p>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lesson.title}
        description={lesson.shortDescription || 'Lesson details'}
        actions={<Link className="text-sm text-(--color-primary)" to="/lessons">Back to Lessons</Link>}
      />

      <SectionCard>
        <SectionHeader title="Lesson Snapshot" actions={<StatusBadge tone={lesson.isFeatured ? 'positive' : 'neutral'} label={lesson.isFeatured ? 'Featured' : 'Standard'} />} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailCard title="Slug">{lesson.slug}</DetailCard>
          <DetailCard title="Publish">{lesson.publishStatus}</DetailCard>
          <DetailCard title="Visibility">{lesson.visibility}</DetailCard>
          <DetailCard title="Difficulty">{lesson.difficulty}</DetailCard>
          <DetailCard title="Instructor">{lesson.instructor || '-'}</DetailCard>
          <DetailCard title="Duration">{lesson.duration || '-'}</DetailCard>
          <DetailCard title="Price">{lesson.price ? `₹${lesson.price}` : '-'}</DetailCard>
          <DetailCard title="Max Participants">{lesson.maxParticipants || '-'}</DetailCard>
          <DetailCard title="Display Order">{lesson.displayOrder}</DetailCard>
        </div>
      </SectionCard>

      {lesson.coverImageUrl ? (
        <SectionCard>
          <SectionHeader title="Cover Image" />
          <img src={lesson.coverImageUrl} alt={lesson.title} className="h-72 w-full rounded-xl object-cover" />
        </SectionCard>
      ) : null}
    </div>
  )
}
