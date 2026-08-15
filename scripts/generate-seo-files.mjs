import fs from 'node:fs'
import path from 'node:path'

const configuredSiteUrl = process.env.VITE_SITE_URL?.trim()
if (process.env.NODE_ENV === 'production' && !configuredSiteUrl) {
  throw new Error('VITE_SITE_URL must be configured for production SEO generation')
}

const siteUrl = (configuredSiteUrl || 'https://surfmangalore.com').replace(/\/+$/, '')

const publicRoutes = [
  '/',
  '/about',
  '/experiences',
  '/lessons',
  '/events',
  '/gallery',
  '/booking',
  '/contact',
]

const robotLines = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin',
  'Disallow: /api',
  'Disallow: /login',
  '',
  `Sitemap: ${siteUrl}/sitemap.xml`,
]

const sitemapUrlset = publicRoutes
  .map((route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`)
  .join('\n')

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrlset}\n</urlset>\n`

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

fs.writeFileSync(path.join(publicDir, 'robots.txt'), `${robotLines.join('\n')}\n`, 'utf8')
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8')
