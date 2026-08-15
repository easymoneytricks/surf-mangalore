import test from 'node:test'
import assert from 'node:assert/strict'

import { bookingCreateBodySchema, bookingUpdateBodySchema } from '../../src/validators/booking.validator'

test('booking create schema accepts valid payload', () => {
  const result = bookingCreateBodySchema.parse({
    bookingType: 'EXPERIENCE',
    selectedItemId: 1,
    preferredDate: '2099-10-10',
    preferredTime: '08:30 AM',
    participants: 3,
    customerName: 'Rahul N',
    email: 'rahul@example.com',
    phone: '+919999999999',
    emergencyContact: '+918888888888',
    specialNotes: 'Beginner group',
  })

  assert.equal(result.bookingType, 'EXPERIENCE')
  assert.equal(result.selectedItemId, 1)
})

test('booking update schema requires at least one field', () => {
  assert.throws(() => bookingUpdateBodySchema.parse({}), {
    name: 'ZodError',
  })
})
