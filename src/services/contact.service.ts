import { API_BASE_URL, safeFetch } from './http'

type ContactMessageCreatePayload = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  source?: string
  captchaToken?: string
}

type ContactMessageResponse = {
  success: boolean
  message: string
  data: {
    id: number
    uuid: string
    name: string
    email: string
  }
}

export async function sendContactMessage(payload: ContactMessageCreatePayload) {
  const response = await safeFetch(`${API_BASE_URL}/contact-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }, 'Unable to send your message right now. Please try again.')

  const json = (await response.json()) as ContactMessageResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to send message')
  }

  return json.data
}

export async function getContactRecaptchaConfig() {
  const response = await safeFetch(`${API_BASE_URL}/contact-messages/recaptcha`, undefined, 'Unable to load contact form security settings.')
  if (!response.ok) return { enabled: false, siteKey: null as string | null }
  const json = await response.json() as { data?: { enabled?: boolean; siteKey?: string | null } }
  return { enabled: Boolean(json.data?.enabled && json.data.siteKey), siteKey: json.data?.siteKey || null }
}
