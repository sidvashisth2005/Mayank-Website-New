import type { NextConfig } from "next";

// The site serves its own fonts, images and API. The only outside origins are
// Clerk (sign-in), Cloudflare Turnstile (Clerk's bot check) and Vercel Blob
// (listing images). Clerk's host is read from the publishable key, so the
// policy names this instance only, not every Clerk customer. Inline scripts
// are allowed because Next.js streams page data through them.
function clerkHost() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  try {
    const host = Buffer.from(key.split("_")[2] ?? "", "base64").toString("utf8").replace(/\$$/, "");
    return /^[a-z0-9.-]+$/i.test(host) ? `https://${host}` : "";
  } catch {
    return "";
  }
}

const clerk = clerkHost();
const turnstile = "https://challenges.cloudflare.com";
const blob = "https://*.public.blob.vercel-storage.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${clerk} ${turnstile}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://img.clerk.com ${blob}`,
  "font-src 'self' data:",
  `connect-src 'self' ${clerk} https://clerk-telemetry.com`,
  `frame-src ${turnstile}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async headers() {
    // The development server needs eval for hot reloading, so the policy is
    // applied to production builds only.
    if (process.env.NODE_ENV !== "production") return [];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
