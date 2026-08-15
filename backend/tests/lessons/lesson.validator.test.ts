import test from 'node:test'
import assert from 'node:assert/strict'

import { lessonCreateBodySchema, lessonUpdateBodySchema } from '../../src/validators/lesson.validator'

test('lesson create schema accepts valid lesson payload', () => {
  const result = lessonCreateBodySchema.parse({
    title: 'Beginner Surf Basics',
    slug: 'beginner-surf-basics',
    shortDescription: 'A calm first lesson for new surfers.',
    fullDescription: 'Learn safe paddling and standing techniques.',
    coverImageUrl: 'https://example.com/cover.jpg',
    difficulty: 'BEGINNER',
    duration: '90 min',
    price: 120,
    maxParticipants: 8,
    instructor: 'Mina',
    publishStatus: 'DRAFT',
    visibility: 'PUBLIC',
    isFeatured: true,
    displayOrder: 1,
    seoTitle: 'Beginner Surf Lesson',
    seoDescription: 'A beginner-friendly surf lesson in Mangalore.',
  })

  assert.equal(result.title, 'Beginner Surf Basics')
  assert.equal(result.slug, 'beginner-surf-basics')
})

test('lesson update schema requires at least one field', () => {
  assert.throws(() => lessonUpdateBodySchema.parse({}), {
    name: 'ZodError',
  })
})
