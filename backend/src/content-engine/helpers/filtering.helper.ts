type QuickFilterBuilder<TWhere> = (quickFilter: string, now: Date) => TWhere | null

export function mergeWhereClauses<TWhere extends object>(...clauses: Array<TWhere | null | undefined>) {
  return Object.assign({}, ...clauses.filter(Boolean)) as TWhere
}

export function buildQuickFilterWhere<TWhere extends object>(
  quickFilter: string | undefined,
  builder: QuickFilterBuilder<TWhere>,
) {
  if (!quickFilter || quickFilter === 'all') {
    return null
  }

  return builder(quickFilter, new Date())
}
