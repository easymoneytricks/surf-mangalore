import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl, getPageSEO } from '../../lib/seo'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'
import { fetchSeoForPath } from '../../services/seo-pages.service'

type SEOProps = {
  pathname: string
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }

  element.href = href
}

export default function SEO({ pathname }: SEOProps) {
  const { settings } = useWebsiteSettings()
  const config = useMemo(() => getPageSEO(pathname), [pathname])
  const [remoteSeo, setRemoteSeo] = useState<Awaited<ReturnType<typeof fetchSeoForPath>>>(null)
  const websiteName = settings.general.websiteName || SITE_NAME
  const fallbackOgImage = settings.seo.openGraphImage ? absoluteUrl(settings.seo.openGraphImage) : DEFAULT_OG_IMAGE

  useEffect(() => {
    let cancelled = false

    fetchSeoForPath(pathname).then((result) => {
      if (!cancelled) {
        setRemoteSeo(result)
      }
    })

    return () => {
      cancelled = true
    }
  }, [pathname])

  const title = remoteSeo?.metaTitle || config.title
  const description = remoteSeo?.metaDescription || config.description
  const keywords = remoteSeo?.metaKeywords?.length ? remoteSeo.metaKeywords : config.keywords
  const robots = remoteSeo?.robots || config.robots
  const canonicalHref = remoteSeo?.canonicalUrl && /^https?:\/\//i.test(remoteSeo.canonicalUrl)
    ? remoteSeo.canonicalUrl
    : absoluteUrl(config.canonicalPath)
  const ogTitle = remoteSeo?.openGraphTitle || title
  const ogDescription = remoteSeo?.openGraphDescription || description
  const ogImage = remoteSeo?.openGraphImage || config.openGraphImage || fallbackOgImage

  useEffect(() => {
    document.title = title
    document.documentElement.lang = 'en'

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
    upsertMeta('meta[name="author"]', { name: 'author', content: websiteName })
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#04131b' })

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: websiteName })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: ogTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: ogDescription })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalHref })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: config.openGraphImageAlt || `${websiteName} preview` })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: ogTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: ogDescription })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage })

    upsertLink('canonical', canonicalHref)

    document.head.querySelectorAll('script[data-seo-schema="true"]').forEach((node) => node.remove())

    config.schemas.forEach((schema, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.seoSchema = 'true'
      script.id = `seo-schema-${index}`
      script.text = JSON.stringify(schema)
      document.head.appendChild(script)
    })
  }, [canonicalHref, config, description, keywords, ogDescription, ogImage, ogTitle, robots, title, websiteName])

  return null
}
