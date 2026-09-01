import type { BookingStepConfig } from '../types/booking'

export type BookingTimeSlot = {
  id: string
  label: string
  period: string
}

export type ParticipantConfig = {
  min: number
  max: number
  defaultValue: number
}

export const bookingSteps: BookingStepConfig[] = [
  {
    id: 'offering',
    label: 'Offering',
    helper: 'Choose whether you want a lesson, experience, or event and then select the specific option.',
  },
  {
    id: 'date',
    label: 'Date',
    helper: 'Select your preferred day so we can hold your planning window.',
  },
  {
    id: 'time',
    label: 'Time',
    helper: 'Pick a time slot that works for your group and travel schedule.',
  },
  {
    id: 'participants',
    label: 'Participants',
    helper: 'Tell us how many guests are joining this booking.',
  },
  {
    id: 'details',
    label: 'Details',
    helper: 'Share contact details so we can confirm and support your session.',
  },
  {
    id: 'review',
    label: 'Review',
    helper: 'Confirm your summary and submit your booking request.',
  },
]

export function bookingStepsForType(type: 'LESSON' | 'EXPERIENCE' | 'EVENT' | ''): BookingStepConfig[] {
  if (type === 'LESSON') return bookingSteps.filter((step) => step.id !== 'time')
  if (type === 'EVENT') return bookingSteps.filter((step) => !['date', 'time'].includes(step.id))
  return bookingSteps
}

export const bookingTimeSlots: BookingTimeSlot[] = [
  { id: '06:30', label: '6:30 AM', period: 'Sunrise lineup' },
  { id: '08:30', label: '8:30 AM', period: 'Morning prime' },
  { id: '10:30', label: '10:30 AM', period: 'Late morning' },
  { id: '15:30', label: '3:30 PM', period: 'Afternoon glide' },
  { id: '17:00', label: '5:00 PM', period: 'Golden hour' },
]

export const bookingParticipantConfig: ParticipantConfig = {
  min: 1,
  max: 20,
  defaultValue: 2,
}
