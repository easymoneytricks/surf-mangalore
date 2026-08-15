import test from 'node:test'
import assert from 'node:assert/strict'

import { galleryCreateBodySchema, galleryUpdateBodySchema } from '../../src/validators/gallery.validator'

test('gallery create schema accepts valid payload', () => {
  const result = galleryCreateBodySchema.parse({
    title: 'Dawn Session',
    slug: 'dawn-session',
    altText: 'Surfer riding a wave at sunrise',
    caption: 'Morning lineup in Mangalore',
    description: 'A calm sunrise surf session frame.',
    albumId: 1,
    mediaId: 101,
    photographer: 'Team SM',
    tags: ['sunrise', 'session'],
    isFeatured: true,
    displayOrder: 1,
    status: 'active',
    publishStatus: 'PUBLISHED',
    visibility: 'PUBLIC',
  })

  assert.equal(result.slug, 'dawn-session')
  assert.equal(result.mediaId, 101)
})

test('gallery update schema requires at least one field', () => {
  assert.throws(() => galleryUpdateBodySchema.parse({}), {
    name: 'ZodError',
  })
})
