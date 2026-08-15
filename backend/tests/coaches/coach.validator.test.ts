import test from 'node:test'
import assert from 'node:assert/strict'

import { coachCreateBodySchema, coachUpdateBodySchema } from '../../src/validators/coach.validator'

test('coach create schema accepts valid payload', () => {
  const result = coachCreateBodySchema.parse({
    fullName: 'Asha Menon',
    slug: 'asha-menon',
    profilePhotoUrl: 'https://example.com/asha.jpg',
    jobTitle: 'Lead Surf Coach',
    shortBio: 'Calm and confidence-building guidance for beginners.',
    fullBio: 'Certified coach with deep local surf knowledge.',
    yearsOfExperience: 9,
    specialization: ['Beginner Coaching', 'Ocean Safety'],
    languages: ['English', 'Hindi'],
    certifications: ['ISA Level 1'],
    phone: '+919999999999',
    email: 'asha@example.com',
    instagramUrl: 'https://instagram.com/asha',
    facebookUrl: 'https://facebook.com/asha',
    linkedinUrl: 'https://linkedin.com/in/asha',
    status: 'active',
    publishStatus: 'DRAFT',
    visibility: 'PUBLIC',
    isFeatured: false,
    displayOrder: 1,
    seoTitle: 'Asha Menon - Surf Coach',
    seoDescription: 'Meet Asha, one of the trusted surf coaches at Surf Mangalore.',
  })

  assert.equal(result.fullName, 'Asha Menon')
  assert.equal(result.slug, 'asha-menon')
})

test('coach update schema requires at least one field', () => {
  assert.throws(() => coachUpdateBodySchema.parse({}), {
    name: 'ZodError',
  })
})
