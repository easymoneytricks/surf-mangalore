import { type SlugAvailabilityChecker } from '../types'

export function generateSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function generateUniqueSlug(baseSlug: string, checker: SlugAvailabilityChecker) {
  const normalizedBase = generateSlug(baseSlug)

  if (await checker(normalizedBase)) {
    return normalizedBase
  }

  let suffix = 2
  while (!(await checker(`${normalizedBase}-${suffix}`))) {
    suffix += 1
  }

  return `${normalizedBase}-${suffix}`
}
