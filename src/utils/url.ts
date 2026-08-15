export function toSafeExternalUrl(value?: string | null) {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined
    }

    return parsed.toString()
  } catch {
    return undefined
  }
}
