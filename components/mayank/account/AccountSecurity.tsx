"use client";

import { UserProfile } from "@clerk/nextjs";

// Clerk's account screens, kept on this page with hash routing.
export function AccountSecurity() {
  return <div className="desk-clerk"><UserProfile routing="hash" /></div>;
}
