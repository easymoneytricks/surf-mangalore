export function buildSearchOrClause<TWhere extends object>(search: string | undefined, fields: string[]) {
  if (!search?.trim()) {
    return null
  }

  const normalized = search.trim()

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: normalized,
        mode: 'insensitive',
      },
    })),
  } as TWhere
}
