export function resolveImageUrl(source: unknown, fallback: string) {
  if (typeof source === 'string' && source.trim()) return source.trim()
  if (source && typeof source === 'object') {
    const candidate = source as { url?: unknown; secure_url?: unknown; imageUrl?: unknown }
    for (const value of [candidate.url, candidate.secure_url, candidate.imageUrl]) {
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
  }
  return fallback
}
