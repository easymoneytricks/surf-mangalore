import { Link, useLocation } from 'react-router-dom'

import { pathToBreadcrumbs } from '../../utils/breadcrumbs'

export default function Breadcrumbs() {
  const location = useLocation()
  const crumbs = pathToBreadcrumbs(location.pathname)

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-xs text-(--color-text-secondary) sm:text-sm">
        {crumbs.map((crumb, index) => (
          <li key={crumb.to} className="flex items-center gap-2">
            {index === crumbs.length - 1 ? (
              <span aria-current="page" className="font-medium text-(--color-text)">{crumb.label}</span>
            ) : (
              <Link to={crumb.to} className="hover:text-(--color-primary)">{crumb.label}</Link>
            )}
            {index < crumbs.length - 1 ? <span>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
