# ai.neck — Marketing Website

Marketing site for ai.neck. The public site leads with End Your Busy Work: find operational friction, remove repetitive work, and give people time back.

Built with **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4**. Every route is statically generated (SSG) for full SEO/performance, with SPA-style client-side transitions between pages.

## Getting started

```bash
npm install
cp .env.example .env.local   # add SMTP_PASS and other secrets
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Architecture notes

- **Routes** live in `src/app/(ai)/`. Marketing pages are the homepage, How It Works (`/how-it-works`, with Discover, Build, and Optimize), Team, and Ai.neck University (`/university/[slug]`, copy in `src/lib/education/`). The guided assessment stays at `/EndYourBusywork`.
- **Design tokens** are CSS variables in `src/app/globals.css`, mapped into Tailwind via `@theme inline`. Contrast-checked pairings are documented at the top of that file.
- **Animations** (workflow metaphor, older graph and spine styles) are pure CSS — no animation library — and fully disabled under `prefers-reduced-motion: reduce`.
- **NAP data** (address, hours, phone, email) has a single source of truth: `src/lib/site.ts`, rendered by `src/components/NapBlock.tsx` in the footer and Contact page.
- **Contact form**: React Hook Form + Zod client-side, posted to `POST /api/contact` (not a Server Action) with honeypot + in-memory rate limiting. Emails go out over SMTP from `noreply@itneck.ai`: a confirmation to the visitor and a copy to support@itneck.com.
- **End Your Busywork** (`/EndYourBusywork`): guided workshop. Visitors join with full name + email, open a magic link, capture multiple ideas per section, then receive an on-screen AI Opportunity Map plus email copies (visitor + support@itneck.com). Mutations use `/api/busywork/*`. Sessions persist in a local SQLite file (`data/busywork.sqlite`).
- **SEO**: unique metadata + canonical per route, Organization/Service/BreadcrumbList JSON-LD (`src/lib/schema.ts`), `sitemap.xml`/`robots.txt`/`manifest` via App Router metadata routes, and per-page 1200×630 OG images generated at build (`src/lib/og.tsx`).
- **Security headers** (HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`.
- **Icons**: the white elephant mark is `public/brand/mascot.png`. Regenerate favicon and app icons onto brand navy with `python scripts/extract-mascot.py` (Sharp’s `generate-icons.mjs` is the same idea when the local Sharp install loads).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` | SMTP host (default `mail.itneck.ai`) |
| `SMTP_PORT` | SMTP port (default `465`) |
| `SMTP_USER` | SMTP username (default `noreply@itneck.ai`) |
| `SMTP_PASS` | SMTP password for `noreply@itneck.ai` |
| `MAIL_FROM` | From header (default `ai.neck <noreply@itneck.ai>`) |
| `MAIL_TO` | Internal inbox (default `support@itneck.com`) |
| `SITE_URL` | Optional production origin override (default `https://itneck.ai`). Local email links use the request Host instead. |
| `BUSYWORK_SQLITE_PATH` | Optional. SQLite file for End Your Busywork (default `data/busywork.sqlite`) |
| `BUSYWORK_SESSION_SECRET` | Required in production. Signs the End Your Busywork session cookie |
| `BUSYWORK_WEBHOOK_URL` | Optional. POST JSON payload on successful workshop submit (CRM) |

## Deployment

Deploy with `next start` behind Apache (or similar). Post-launch checklist:

1. Connect the custom domain (`itneck.ai`).
2. Set `SMTP_PASS` (and related SMTP env vars). Apache must proxy `POST /api/*` to the Node process — not static HTML.
3. Set `BUSYWORK_SESSION_SECRET` (required). Magic-link redirects use `SITE_URL` (`https://itneck.ai`), not the Node bind address. The SQLite file is created automatically at `data/busywork.sqlite` (or `BUSYWORK_SQLITE_PATH`).
4. Submit `https://itneck.ai/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
5. Validate JSON-LD with Google's Rich Results Test.
6. Before using official Microsoft logos anywhere, check Microsoft's Partner Brand Guidelines — the site currently uses neutral abstract line icons on purpose.
