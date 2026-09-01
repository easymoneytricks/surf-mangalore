import { motion } from 'framer-motion'
import Button from '../Button'
import Card from '../Card'
import { navigateTo } from '../../utils/navigation'

type BookingSuccessProps = {
  guestName: string
  confirmation?: {
    reference: string
    activity: string
    date: string
    time: string
    participants: number
    location: string
    paymentNotice: string
    support: string
    bookingType?: 'LESSON' | 'EXPERIENCE' | 'EVENT'
  } | null
  onCreateAnother: () => void
}

function downloadConfirmationPdf(confirmation: NonNullable<BookingSuccessProps['confirmation']>) {
  const heading = confirmation.bookingType === 'LESSON' ? 'Lesson Reservation' : confirmation.bookingType === 'EXPERIENCE' ? 'Experience Ticket' : 'Event Ticket'
  const lines = [heading, `Reference: ${confirmation.reference}`, `Activity: ${confirmation.activity}`, `Date: ${confirmation.date}`, `Time: ${confirmation.time}`, `Participants: ${confirmation.participants}`, `Location: ${confirmation.location}`, `Payment: ${confirmation.paymentNotice}`]
  const esc = (value: string) => value.replace(/\\/g, '\\\\').replace(/[()]/g, '\\$&')
  const stream = `BT /F1 14 Tf 50 760 Td (${esc(lines[0])}) Tj /F1 10 Tf 0 -26 Td ${lines.slice(1).map((line) => `(${esc(line)}) Tj 0 -18 Td`).join(' ')} ET`
  const objects = [`<< /Type /Catalog /Pages 2 0 R >>`, `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`]
  let pdf = '%PDF-1.4\n'; const offsets = [0]
  objects.forEach((object, index) => { offsets[index + 1] = pdf.length; pdf += `${index + 1} 0 obj\n${object}\nendobj\n` })
  const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${confirmation.reference}-confirmation.pdf`; anchor.click(); URL.revokeObjectURL(url)
}

export default function BookingSuccess({ guestName, confirmation, onCreateAnother }: BookingSuccessProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card variant="feature" className="border-white/12 p-8 sm:p-10">
        <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">{confirmation?.bookingType === 'LESSON' ? 'Lesson Reservation' : confirmation?.bookingType === 'EXPERIENCE' ? 'Experience Ticket' : confirmation?.bookingType === 'EVENT' ? 'Event Ticket' : 'Booking request received'}</p>
        <h2 className="mt-4 max-w-[18ch] text-[clamp(1.8rem,3.2vw,2.5rem)] font-semibold leading-[1.05] text-white">
          Thanks{guestName ? `, ${guestName}` : ''}. Your booking request is in.
        </h2>
        <p className="mt-4 max-w-[40rem] text-base leading-8 text-[var(--color-text-secondary)]">
          Our team will review your request and share confirmation details shortly. We are excited to help you plan a smooth and memorable surf day.
        </p>

        {confirmation ? (
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/90 sm:p-5">
            <p><span className="text-white/70">Reference:</span> {confirmation.reference}</p>
            <p><span className="text-white/70">Activity:</span> {confirmation.activity}</p>
            <p><span className="text-white/70">Date:</span> {confirmation.date}</p>
            <p><span className="text-white/70">Time:</span> {confirmation.time}</p>
            <p><span className="text-white/70">Participants:</span> {confirmation.participants}</p>
            <p><span className="text-white/70">Location:</span> {confirmation.location}</p>
            <p><span className="text-white/70">Payment:</span> {confirmation.paymentNotice}</p>
            <p><span className="text-white/70">Support:</span> {confirmation.support}</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" size="lg" onClick={() => navigateTo('/events')}>
            Explore events
          </Button>
          <Button variant="outline" size="lg" onClick={() => confirmation && downloadConfirmationPdf(confirmation)}>
            Download confirmation PDF
          </Button>
          <Button variant="outline" size="lg" onClick={onCreateAnother}>
            Create another booking
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
