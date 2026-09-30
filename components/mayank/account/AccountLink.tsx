"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { TransitionLink } from "../PageTransition";

// Header entry to the member area. Renders nothing until Clerk knows the
// session, so the header never flashes the wrong state.
export function AccountLink({ className, onNavigate, long }: { className?: string; onNavigate?: () => void; long?: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  if (!isLoaded) return <span className={className} aria-hidden="true" data-pending />;
  if (!isSignedIn) {
    return <TransitionLink className={className} href="/sign-in" onClick={onNavigate}>{long ? "Sign in or create an account" : "Sign in"}</TransitionLink>;
  }
  const name = user?.firstName || user?.username || "";
  const initials = (name || user?.primaryEmailAddress?.emailAddress || "M").slice(0, 2).toUpperCase();
  return (
    <TransitionLink className={className} href="/dashboard" onClick={onNavigate} aria-label={long ? undefined : "Your desk"}>
      {long ? "Your desk" : <><i aria-hidden="true">{initials}</i>Desk</>}
    </TransitionLink>
  );
}
