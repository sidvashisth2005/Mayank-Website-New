import type { ReactNode } from "react";

// Split page for sign-in and sign-up: what an account is for on the left,
// Clerk's form on the right.

const uses = [
  ["List and track", "Send assets for private review and follow each one from submission to transfer."],
  ["One inbox", "Enquiries from buyers and notes from the review desk arrive in one place."],
  ["A watchlist", "Save records from the market and come back to them later."],
  ["Reviews", "Rate an asset after a completed transfer. Only verified buyers can."],
];

export function AuthStage({ label, title, children }: { label: string; title: ReactNode; children: ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className="auth-page">
      <section className="auth-copy">
        <span className="label">{label}</span>
        <h1>{title}</h1>
        <ol>
          {uses.map(([heading, copy], index) => (
            <li key={heading}><span>{String(index + 1).padStart(2, "0")}</span><strong>{heading}</strong><p>{copy}</p></li>
          ))}
        </ol>
        <p className="auth-fine">Accounts are free. Mayank never asks for payment details at sign-up.</p>
      </section>
      <section className="auth-form" aria-label="Account form">{children}</section>
    </main>
  );
}
