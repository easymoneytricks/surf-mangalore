import { type SeoInput } from '../types'

export function normalizeSeoInput(input: SeoInput) {
  return {
    seoTitle: input.seoTitle?.trim() || undefined,
    seoDescription: input.seoDescription?.trim() || undefined,
    metaKeywords: (input.metaKeywords || []).map((keyword) => keyword.trim()).filter(Boolean),
  }
}
