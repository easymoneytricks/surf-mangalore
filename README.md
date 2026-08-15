# Surf Mangalore

Premium surf-school marketing site for Surf Mangalore, built with React, TypeScript, Vite, Tailwind, and Framer Motion.

## Scripts

- `npm run dev` starts the local dev server.
- `npm run build` runs the production typecheck and bundle.
- `npm run lint` runs Oxlint across the workspace.
- `npm run preview` serves the production build locally.

## Architecture

The app is a single-page React shell with route-aware metadata, shared layout chrome, and data-driven page sections. The route map lives in `src/App.tsx`, the shared shell lives in `src/layouts/MainLayout.tsx`, and page content is composed from reusable components under `src/components/` and static content modules under `src/data/`.

For a deeper breakdown of the system, see [docs/architecture.md](docs/architecture.md).

## Working Notes

- Route changes update the browser history and trigger client-side navigation.
- SEO metadata and structured data are managed centrally in `src/lib/seo.ts` and `src/components/seo/SEO.tsx`.
- Design tokens live in `src/styles/theme.css` and are imported globally through `src/index.css`.
