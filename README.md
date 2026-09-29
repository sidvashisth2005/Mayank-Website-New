# Mayank

Mayank is a reviewed marketplace for buying, renting and listing startup-built digital assets: complete products, code, domains, design systems and templates.

## Routes

| Route | Purpose |
|---|---|
| `/` | Loader, hero, live index preview, categories, transfer reel, handover method, seller band |
| `/market` | Searchable, filterable index (filters live in the URL) with Index and Specimens views |
| `/market/[slug]` | One record per asset: working sample, condition ledger, transfer route, private enquiry |
| `/sell` | Six-step listing form with a draft saved on the device |
| `/how-it-works` | Buyer and seller tracks, review standard, boundaries, questions |
| `/terms`, `/privacy`, `/restricted-assets` | Governance drafts for professional review |

The Edition 01 records in `lib/assets.ts` are sample listings.

## Local development

```bash
npm install
npm run dev
```

## Email delivery

Listings (`/api/listings`) and enquiries (`/api/enquiries`) are validated with the schemas in `lib/schemas.ts` and delivered through [Resend](https://resend.com). Without these variables the site runs in demo mode and says so on screen.

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | API key from Resend |
| `MAYANK_INBOX_EMAIL` | Address that receives listings and enquiries |
| `MAYANK_FROM_EMAIL` | Sender, e.g. `Mayank <review@yourdomain.com>` (needs a domain verified in Resend) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata and the sitemap |

Put them in `.env.local` for local work and in the Vercel project settings for production.

## Structure

- `app/` routes, API handlers and `styles/` (one CSS file per area, imported by `globals.css`)
- `components/mayank/` site components: shell, page transition, market, record, forms, home sections
- `lib/` asset data, validation schemas, mail client, scroll helpers

## Deploy

Import into Vercel as a Next.js project. Build `npm run build`, start `npm run start`, Node.js 20.9 or newer.
