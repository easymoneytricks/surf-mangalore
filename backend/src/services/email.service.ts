import nodemailer from 'nodemailer'
import { env } from '../config/env'
import { settingsService } from './settings.service'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character))
}

async function getTransport() {
  const settings = await settingsService.getStoredWebsiteSettings()
  const email = settings.email
  const host = email.smtpHost || env.SMTP_HOST
  const username = email.smtpUsername || env.SMTP_USER
  const password = email.smtpPassword || env.SMTP_PASSWORD
  const fromEmail = email.fromEmail || env.SMTP_FROM_EMAIL
  if (!host || !username || !password || !fromEmail) return null
  const secure = String(email.smtpSecurity) === 'ssl'
  return { transport: nodemailer.createTransport({ host, port: email.smtpPort || env.SMTP_PORT, secure, auth: { user: username, pass: password } }), fromEmail, fromName: email.fromName || env.SMTP_FROM_NAME, replyTo: email.replyToEmail || env.SMTP_REPLY_TO, adminEmail: email.adminNotificationEmail || env.SMTP_ADMIN_EMAIL }
}

export async function sendContactReply(input: { to: string; name: string; subject?: string; message: string }) {
  const config = await getTransport()
  if (!config) throw new Error('Email notifications are not configured.')
  const safeName = escapeHtml(input.name)
  const safeMessage = escapeHtml(input.message).replace(/\r?\n/g, '<br />')
  await config.transport.sendMail({
    from: `${config.fromName || 'Surf Mangalore'} <${config.fromEmail}>`,
    to: input.to,
    replyTo: config.replyTo || config.fromEmail,
    subject: input.subject?.startsWith('Re:') ? input.subject : `Re: ${input.subject || 'Your enquiry'}`,
    text: `Hi ${input.name},\n\n${input.message}\n\nSurf Mangalore\nMangalore, Karnataka`,
    html: `<div style="font-family:Arial,sans-serif;color:#123;background:#f5fafb;padding:32px"><div style="max-width:600px;margin:auto;background:white;border-radius:16px;padding:28px"><h2 style="color:#0b5661">Surf Mangalore</h2><p>Hi ${safeName},</p><p>${safeMessage}</p><p style="margin-top:28px">Surf Mangalore<br/>Mangalore, Karnataka</p></div></div>`,
  })
}

export async function sendAdminContactNotification(input: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  const config = await getTransport()
  if (!config || !config.adminEmail) return false
  const safe = (value: string) => escapeHtml(value).replace(/\r?\n/g, '<br />')
  await config.transport.sendMail({
    from: `${config.fromName || 'Surf Mangalore'} <${config.fromEmail}>`,
    to: config.adminEmail,
    replyTo: input.email,
    subject: `New Contact Enquiry — ${input.subject || input.name}`,
    text: `New Contact Enquiry\nName: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone || 'Not provided'}\nSubject: ${input.subject || 'No subject'}\n\n${input.message}`,
    html: `<div style="font-family:Arial,sans-serif"><h2>New Contact Enquiry</h2><p><b>Name:</b> ${safe(input.name)}</p><p><b>Email:</b> ${safe(input.email)}</p><p><b>Phone:</b> ${safe(input.phone || 'Not provided')}</p><p><b>Subject:</b> ${safe(input.subject || 'No subject')}</p><p><b>Message:</b><br/>${safe(input.message)}</p></div>`,
  })
  return true
}

export async function sendTestEmail(to: string) {
  const config = await getTransport()
  if (!config) throw new Error('Email notifications are not configured.')
  await config.transport.sendMail({ from: `${config.fromName || 'Surf Mangalore'} <${config.fromEmail}>`, to, replyTo: config.replyTo || config.fromEmail, subject: 'Surf Mangalore — SMTP Test Successful', text: 'Your Surf Mangalore SMTP configuration is working.', html: '<div style="font-family:Arial,sans-serif"><h2>Surf Mangalore</h2><p>Your SMTP configuration is working.</p></div>' })
}

export async function sendBookingStatusEmail(input: { to: string; customerName: string; reference: string; bookingType: string; title: string; status: string; bookingDate: Date; preferredTime?: string | null; participants: number; price?: number | null }) {
  const config = await getTransport()
  if (!config) throw new Error('Email notifications are not configured.')
  const labels: Record<string, string> = { CONFIRMED: 'Booking Confirmed', COMPLETED: 'Booking Completed', CANCELLED: 'Booking Cancelled' }
  const heading = labels[input.status] || 'Booking Status Updated'
  const accent = input.status === 'CANCELLED' ? '#b94a55' : '#0b7f86'
  const statusMessage = input.status === 'COMPLETED'
    ? 'Thank you for choosing Surf Mangalore. We hope you had an unforgettable time with us.'
    : input.status === 'CANCELLED'
      ? 'We are sorry for the inconvenience caused. If you need help with another date, please contact our team.'
      : 'Your booking has been confirmed. Payment can be completed on the ground when you arrive.'
  const date = input.bookingDate.toLocaleDateString('en-IN', { dateStyle: 'long' })
  const details = `<p><b>Reference:</b> ${escapeHtml(input.reference)}</p><p><b>${escapeHtml(input.bookingType)}:</b> ${escapeHtml(input.title)}</p><p><b>Date:</b> ${date}</p>${input.preferredTime ? `<p><b>Time:</b> ${escapeHtml(input.preferredTime)}</p>` : ''}<p><b>Participants:</b> ${input.participants}</p>${input.price != null ? `<p><b>Estimated total:</b> ₹${input.price.toLocaleString('en-IN')}</p>` : ''}`
  await config.transport.sendMail({ from: `${config.fromName || 'Surf Mangalore'} <${config.fromEmail}>`, to: input.to, replyTo: config.replyTo || config.fromEmail, subject: `${heading} — ${input.reference}`, text: `Hi ${input.customerName},\n\n${heading}\nReference: ${input.reference}\n${input.title}\nDate: ${date}\nParticipants: ${input.participants}\n\n${statusMessage}\n\nSurf Mangalore`, html: `<div style="margin:0;background:#eef5f5;padding:32px;font-family:Arial,sans-serif;color:#17323a"><div style="max-width:620px;margin:auto;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 12px 35px #1232"><div style="background:#062b3a;padding:28px 32px;color:#d9ffff"><div style="font-size:12px;letter-spacing:3px">SURF MANGALORE</div><h1 style="margin:12px 0 0;font-size:28px">${heading}</h1></div><div style="padding:32px"><p>Hi ${escapeHtml(input.customerName)},</p><p>Your booking status has been updated. Here are the latest details:</p><div style="border-left:4px solid ${accent};background:#f4fafa;border-radius:10px;padding:18px 20px">${details}</div><p style="margin-top:26px">${statusMessage}</p><p style="color:#567">${input.status === 'CANCELLED' ? 'Please reach out if we can help with a future visit.' : input.status === 'COMPLETED' ? 'We look forward to welcoming you back to the coast.' : 'We look forward to welcoming you to the coast.'}</p></div><div style="background:#f2f7f7;padding:18px 32px;color:#567;font-size:12px">Surf Mangalore · Mangalore, Karnataka</div></div></div>` })
}
