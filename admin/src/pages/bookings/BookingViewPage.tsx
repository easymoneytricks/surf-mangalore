import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  DetailCard,
  FormActions,
  Modal,
  PageHeader,
  PrimaryButton,
  SectionCard,
  SectionHeader,
  SelectInput,
  SecondaryButton,
  StatusBadge,
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { bookingsService } from '../../services/bookings.service'
import { type BookingEntity, type BookingStatus } from '../../types/bookings'

const STATUS_OPTIONS: Array<{ label: string; value: BookingStatus }> = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'No Show', value: 'NO_SHOW' },
]

export default function BookingViewPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState<BookingEntity | null>(null)
  const [status, setStatus] = useState<BookingStatus>('PENDING')
  const [statusNote, setStatusNote] = useState('')
  const [assignedInstructor, setAssignedInstructor] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [confirmStatus, setConfirmStatus] = useState<BookingStatus | null>(null)

  const loadBooking = () => {
    if (!id) {
      return
    }

    bookingsService
      .getById(Number(id))
      .then((result) => {
        setBooking(result)
        setStatus(result.bookingStatus)
        setAssignedInstructor(result.assignedInstructor || '')
        setInternalNotes(result.internalNotes || '')
      })
      .catch((fetchError: Error) => setError(fetchError.message))
  }

  useEffect(() => {
    loadBooking()
  }, [id])

  const handleStatusUpdate = async (nextStatus = status) => {
    if (!booking) {
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const updated = await bookingsService.patchStatus(booking.id, {
        bookingStatus: nextStatus,
        note: statusNote || undefined,
      })
      setBooking(updated)
      setStatus(nextStatus)
      setSuccessMessage('Booking status updated')
      setStatusNote('')
      setConfirmStatus(null)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to update booking status')
    } finally {
      setSaving(false)
    }
  }

  const handleBookingUpdate = async () => {
    if (!booking) {
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const updated = await bookingsService.patch(booking.id, {
        assignedInstructor: assignedInstructor || undefined,
        internalNotes: internalNotes || undefined,
      })
      setBooking(updated)
      setSuccessMessage('Booking details updated')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to update booking details')
    } finally {
      setSaving(false)
    }
  }

  if (error && !booking) {
    return <p className="text-sm text-rose-200">{error}</p>
  }

  if (!booking) {
    return <p className="text-sm text-(--color-text-secondary)">Loading booking...</p>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={booking.bookingReference}
        description={`${booking.customer.name} · ${booking.selectedItem?.title || 'Unknown item'}`}
        actions={<Link className="text-sm text-(--color-primary)" to="/bookings">Back to Bookings</Link>}
      />

      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
      {successMessage ? <p className="rounded-xl border border-emerald-300/40 bg-emerald-300/15 px-3 py-2 text-sm text-emerald-100">{successMessage}</p> : null}

      <SectionCard>
        <SectionHeader title="Booking Snapshot" actions={<StatusBadge tone={booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'COMPLETED' ? 'positive' : booking.bookingStatus === 'PENDING' ? 'warning' : 'neutral'} label={booking.bookingStatus} />} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailCard title="Booking Type">{booking.bookingType}</DetailCard>
          <DetailCard title="Selected Item">{booking.selectedItem?.title || '-'}</DetailCard>
          <DetailCard title={booking.bookingType === 'LESSON' ? 'Training Start Date' : booking.bookingType === 'EVENT' ? 'Event Date' : 'Experience Date'}>{new Date(booking.bookingDate).toISOString().slice(0, 10)}</DetailCard>
          <DetailCard title={booking.bookingType === 'EVENT' ? 'Event Start / End Time' : booking.bookingType === 'EXPERIENCE' ? 'Experience Time Slot' : 'Training Time'}>{booking.preferredTime || (booking.bookingType === 'EVENT' ? `${booking.event?.startTimeLabel || ''}${booking.event?.endTimeLabel ? ` – ${booking.event.endTimeLabel}` : ''}` : '-')}</DetailCard>
          <DetailCard title="Participants">{booking.participants}</DetailCard>
          <DetailCard title="Activity">{booking.activity || booking.selectedItem?.title || '-'}</DetailCard>
          <DetailCard title="Location">{booking.location || '-'}</DetailCard>
          <DetailCard title="Assigned Instructor">{booking.assignedInstructor || '-'}</DetailCard>
          <DetailCard title="Customer">{booking.customer.name}</DetailCard>
          <DetailCard title="Email">{booking.customer.email}</DetailCard>
          <DetailCard title="Phone">{booking.customer.phone || '-'}</DetailCard>
          <DetailCard title="Emergency Contact">{booking.customer.emergencyContact || '-'}</DetailCard>
          <DetailCard title="Created At">{new Date(booking.createdAt).toLocaleString()}</DetailCard>
          <DetailCard title="Updated At">{new Date(booking.updatedAt).toLocaleString()}</DetailCard>
          <DetailCard title="Payment">{booking.paymentNotice || 'Payment is collected at the venue.'}</DetailCard>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader title="Manage Booking" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectInput label="Booking Status" value={status} onChange={(value) => setStatus(value as BookingStatus)} options={STATUS_OPTIONS} />
          <TextInput label="Assigned Instructor" value={assignedInstructor} onChange={(event) => setAssignedInstructor(event.target.value)} />
          <TextareaInput label="Status Change Note" value={statusNote} onChange={(event) => setStatusNote(event.target.value)} className="md:col-span-2" />
          <TextareaInput label="Internal Notes" value={internalNotes} onChange={(event) => setInternalNotes(event.target.value)} className="md:col-span-2" />
        </div>
        <FormActions>
          <SecondaryButton onClick={loadBooking} disabled={saving}>Refresh</SecondaryButton>
          <PrimaryButton onClick={handleBookingUpdate} disabled={saving}>{saving ? 'Saving...' : 'Save Details'}</PrimaryButton>
          <PrimaryButton onClick={() => setConfirmStatus(status)} disabled={saving}>{saving ? 'Saving...' : 'Update Status'}</PrimaryButton>
        </FormActions>
        <div className="mt-3 flex flex-wrap gap-2">
          <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setConfirmStatus('CONFIRMED')}>Confirm</SecondaryButton>
          <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setConfirmStatus('COMPLETED')}>Mark Completed</SecondaryButton>
          <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setConfirmStatus('NO_SHOW')}>Mark No-show</SecondaryButton>
          <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setConfirmStatus('CANCELLED')}>Cancel Booking</SecondaryButton>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader title="Activity History" />
        <div className="space-y-3">
          {booking.activityHistory.length ? booking.activityHistory.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/12 bg-white/6 p-3 text-sm">
              <p className="text-(--color-text)">{item.action} {item.oldStatus || item.newStatus ? `(${item.oldStatus || '-'} → ${item.newStatus || '-'})` : ''}</p>
              <p className="text-(--color-text-secondary)">{new Date(item.createdAt).toLocaleString()} {item.adminUser ? `· ${item.adminUser.name}` : '· System'}</p>
              {item.note ? <p className="mt-1 text-(--color-text-secondary)">{item.note}</p> : null}
            </div>
          )) : <p className="text-sm text-(--color-text-secondary)">No activity recorded yet.</p>}
        </div>
      </SectionCard>

      <Modal
        isOpen={Boolean(confirmStatus)}
        title="Confirm Status Change"
        onClose={() => setConfirmStatus(null)}
        footer={(
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setConfirmStatus(null)}>Back</SecondaryButton>
            <PrimaryButton onClick={() => void handleStatusUpdate(confirmStatus || status)} disabled={saving}>
              {saving ? 'Updating...' : `Set ${confirmStatus || status}`}
            </PrimaryButton>
          </div>
        )}
      >
        <p className="text-sm text-(--color-text-secondary)">
          This action will update booking status and write an audit trail entry.
        </p>
        {statusNote ? <p className="mt-2 text-xs text-(--color-text-secondary)">Note: {statusNote}</p> : null}
      </Modal>
    </div>
  )
}
