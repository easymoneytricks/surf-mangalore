export function pathToBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)

  if (!segments.length) {
    return [{ label: 'Dashboard', to: '/dashboard' }]
  }

  return segments.map((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join('/')}`
    const label = segment
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')

    return { label, to }
  })
}
