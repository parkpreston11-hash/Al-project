# Eleanor & Co. — Real Estate & Loan Officer Website

A full-stack premium real estate + loan officer website for a dual-licensed Realtor and Loan Officer serving the Austin, TX metro area.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied to `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Optional env: `ADMIN_PASSWORD` — admin dashboard password (default: `admin123`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Shadcn/ui components, Framer Motion, Wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/realty-site/` — React+Vite frontend (served at `/`)
- `artifacts/api-server/` — Express API (served at `/api`)
- `lib/api-zod/` — Generated Zod schemas and TypeScript types (from OpenAPI spec)
- `lib/api-client-react/` — Generated React Query hooks + custom-fetch utility
- `lib/db/` — Drizzle schema (`listingsTable`, `leadsTable`)

## Architecture decisions

- **Dual-licensed advisor model**: Site positions one professional as both Realtor and Loan Officer. All copy, CTAs, and disclaimers reflect this.
- **Admin auth is token-based**: Static token `realty-admin-token-2024` stored in localStorage, passed as `Authorization: Bearer` header via `setAuthTokenGetter` from `@workspace/api-client-react`.
- **Date serialization**: Drizzle returns `Date` objects; all API routes use `JSON.parse(JSON.stringify(data))` to serialize dates to ISO strings before Zod validation.
- **Contract-first API**: OpenAPI spec in `lib/api-spec/`, generates Zod schemas (`lib/api-zod/`) and React Query hooks (`lib/api-client-react/`). Run codegen after any spec change.

## Product

**10 public pages:**
- `/` — Homepage (hero, stats, featured listings, recently sold, loan programs, roadmap, testimonials, CTA)
- `/listings` — Active property listings grid
- `/listings/:id` — Property detail with image gallery, specs, features, estimated payment
- `/sold` — Recently sold homes gallery
- `/sell` — Seller lead capture form
- `/loans` — Loan program overview with disclaimer
- `/calculator` — Mortgage payment estimator
- `/home-buying-plan` — Buyer intake form
- `/about` — Agent bio, credentials, areas served
- `/contact` — Contact form + office info

**Admin:**
- `/admin` — Login page (password: `admin123`)
- `/admin/dashboard` — Lead management: stats, list with filter/search/tabs, detail panel with status and notes

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **Drizzle date serialization**: Always `JSON.parse(JSON.stringify(rows))` before `ZodSchema.parse()` — Drizzle returns `Date` objects, Zod schemas expect ISO strings.
- **Framer Motion `ease` values**: Must use `"easeOut" as const` (not plain string) to satisfy TS `Easing` type.
- **Admin token**: `realty-admin-token-2024` is hardcoded. Call `setAuthTokenGetter(() => localStorage.getItem("admin_token"))` on app init (done in `AdminDashboard.tsx` useEffect).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
