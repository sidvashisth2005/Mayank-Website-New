// Canonical origin for metadata, sitemap and robots. Set NEXT_PUBLIC_SITE_URL
// once a domain exists; Vercel's production URL is used until then.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
