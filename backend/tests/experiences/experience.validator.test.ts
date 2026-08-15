import test from 'node:test'
import assert from 'node:assert/strict'

import { experienceCreateBodySchema, experienceUpdateBodySchema } from '../../src/validators/experience.validator'

test('experience create schema accepts valid experience payload', () => {
  const result = experienceCreateBodySchema.parse({
    title: 'Beginner Ocean Experience',
    slug: 'beginner-ocean-experience',
    shortDescription: 'A guided beginner-first ocean session.',
    fullDescription: 'This experience combines surf foundations with calm progression.',
    coverImageUrl: 'https://example.com/cover.jpg',
    galleryImageUrls: ['https://example.com/gallery-1.jpg'],
    category: 'Beginner Pathway',
    difficulty: 'BEGINNER',
    recommendedAge: '12+',
    duration: '90 minutes',
    maxParticipants: 8,
    basePrice: 1800,
    discountPrice: 1500,
    instructor: 'Coach Arjun',
    linkedLessonIds: [1, 2],
    status: 'active',
    publishStatus: 'DRAFT',
    visibility: 'PUBLIC',
    isFeatured: true,
    displayOrder: 2,
    seoTitle: 'Beginner Ocean Experience',
    seoDescription: 'Ideal first surf experience in Mangalore.',
  })

  assert.equal(result.title, 'Beginner Ocean Experience')
  assert.equal(result.slug, 'beginner-ocean-experience')
})

test('experience update schema requires at least one field', () => {
  assert.throws(() => experienceUpdateBodySchema.parse({}), {
    name: 'ZodError',
  })
})
