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
  } | null
  onCreateAnother: () => void
}

export default function BookingSuccess({ guestName, confirmation, onCreateAnother }: BookingSuccessProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card variant="feature" className="border-white/12 p-8 sm:p-10">
        <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Booking request received</p>
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
          <Button variant="outline" size="lg" onClick={onCreateAnother}>
            Create another booking
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
