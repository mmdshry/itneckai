# ai.neck — Marketing Website

Marketing site for ai.neck, a San Diego-based AI solutions company specializing in Microsoft Copilot agents across SharePoint, Teams, OneDrive, Outlook, and Microsoft 365.

Built with **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4**. Every route is statically generated (SSG) for full SEO/performance, with SPA-style client-side transitions between pages.

## Getting started

```bash
npm install
cp .env.example .env.local   # add your RESEND_API_KEY for the contact form
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Architecture notes

- **Routes** live in `src/app/`. The five Copilot product pages are one dynamic route (`solutions/microsoft-copilot-agents/[product]`) statically generated from `src/lib/copilot-agents.ts` — edit that file to change product copy.
- **Design tokens** are CSS variables in `src/app/globals.css`, mapped into Tailwind via `@theme inline`. Contrast-checked pairings are documented at the top of that file.
- **Animations** (Agent Graph hero, Signal Spine scroll fill) are pure CSS — no animation library — and fully disabled under `prefers-reduced-motion: reduce`.
- **NAP data** (address, hours, phone, email) has a single source of truth: `src/lib/site.ts`, rendered by `src/components/NapBlock.tsx` in the footer, About, and Contact pages.
- **Contact form**: React Hook Form + Zod client-side, re-validated server-side in `src/app/contact/actions.ts` (server action) with honeypot + in-memory rate limiting, delivered via [Resend](https://resend.com) to Support@ITneck.com.
- **SEO**: unique metadata + canonical per route, Organization/Service/BreadcrumbList JSON-LD (`src/lib/schema.ts`), `sitemap.xml`/`robots.txt`/`manifest` via App Router metadata routes, and per-page 1200×630 OG images generated at build (`src/lib/og.tsx`).
- **Security headers** (HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`.
- **Icons**: regenerate favicon/app icons from `public/brand/favicon.png` with `node scripts/generate-icons.mjs`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key for contact-form email delivery |
| `CONTACT_FROM_EMAIL` | Verified sender address (falls back to `onboarding@resend.dev`) |

## Deployment

Deploy on Vercel. Post-launch checklist:

1. Connect the custom domain (`www.itneck.com`).
2. Set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (verify the domain in Resend first).
3. Submit `https://www.itneck.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
4. Validate JSON-LD with Google's Rich Results Test.
5. Before using official Microsoft logos anywhere, check Microsoft's Partner Brand Guidelines — the site currently uses neutral abstract line icons on purpose.
