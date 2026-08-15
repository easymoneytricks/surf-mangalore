# Architecture Overview

## Project Structure

Surf Mangalore is a client-rendered React application built with Vite and TypeScript. The codebase is organized around a small set of ownership boundaries:

- `src/App.tsx` owns route resolution and page selection.
- `src/layouts/` contains the shared shell for global navigation, SEO, skip links, and footer chrome.
- `src/components/` contains reusable UI primitives and page sections grouped by domain.
- `src/data/` contains static content and page data that can later be replaced by a CMS or API.
- `src/lib/` contains cross-cutting utilities such as SEO helpers.
- `src/styles/` contains global design tokens and base styling.
- `public/` contains static assets, discovery files, and placeholder imagery.

The current structure is intentionally flat enough for small-team maintenance while still separating concerns by feature area.

## Routing

Routing is handled inside `src/App.tsx` with a simple pathname map. The app reads `window.location.pathname`, selects the corresponding page component, and falls back to the existing not-found page when a route is unknown.

Navigation is client-side only. Shared buttons and navigation controls call `navigateTo` or receive the route `navigate` callback from the app shell. This keeps the browser history in sync without requiring a router dependency.

## Data Flow

The site follows a mostly one-way data flow:

1. Static page data is defined in `src/data/*.ts`.
2. Page components import that content and render it through reusable sections.
3. The app shell passes navigation state into layout components.
4. `SEO` derives metadata and structured data from the current pathname.
5. The browser URL updates through the history API and the shell re-renders the active page.

This model keeps business logic thin and makes content updates straightforward.

## Component Hierarchy

The top-level render tree is:

`main.tsx` -> `App.tsx` -> `MainLayout` -> page component -> feature sections -> shared primitives

Shared primitives such as `Button`, `Card`, `Logo`, `Container`, `Heading`, `Section`, and `Badge` are designed to be reused across pages. Feature folders such as `home`, `experiences`, `events`, `gallery`, `about`, `booking`, and `contact` group larger domain-specific sections together.

The hierarchy is optimized for composition rather than inheritance. Page shells stay small, and section components own their own concerns.

## TypeScript Strategy

TypeScript is used to keep the site maintainable rather than to create a heavy abstraction layer. Current patterns include:

- explicit prop types for shared components
- typed data models for page content and booking state
- narrow utility types in SEO and navigation helpers
- no reliance on `any`

The codebase favors readable explicit types over clever generic machinery unless the abstraction genuinely benefits from it.

## Future Backend Integration

The current frontend-only architecture is ready for a backend in a few predictable places:

- booking submission can move from local confirmation to an API request
- contact form submission can connect to email, CRM, or ticketing systems
- page content can be hydrated from a content service instead of static files
- analytics events can be emitted from navigation and CTA actions

The recommended approach is to introduce a thin API client layer before moving any page logic.

## Future CMS Integration

The data modules are shaped to make a CMS migration low risk. Each content-heavy surface is already isolated into data files and reusable sections, so a CMS can replace the static modules one domain at a time.

Recommended migration path:

- start with gallery, events, and FAQs
- move page metadata and hero copy next
- keep shared design primitives intact
- preserve the route structure so the UI does not need a redesign

## Future Admin Integration

If an admin surface is introduced later, it should not be coupled to the public marketing site. A separate admin app or secured route group should own operational workflows such as:

- booking management
- enquiry triage
- content editing
- gallery uploads
- event publishing

Keeping the admin experience separate will reduce risk to the public marketing site.

## Deployment Strategy

The app is currently suitable for static hosting or edge deployment:

- build with `npm run build`
- serve the generated `dist/` output from a static host
- configure the host to rewrite unknown routes to `index.html`
- provide the production site URL through `VITE_SITE_URL` so SEO helpers generate correct canonical URLs

Static assets in `public/` are already aligned with that deployment model.

## Maintenance Notes

- Keep route definitions centralized so metadata and navigation stay synchronized.
- Prefer feature-local data files over deeply nested prop chains.
- Add new shared primitives only when a pattern appears at least twice.
- Preserve the current visual system by extending tokens in `src/styles/theme.css` instead of introducing ad hoc one-off styles.