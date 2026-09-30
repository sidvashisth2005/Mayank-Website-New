"use client";

import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { savedState, toggleSaved } from "@/app/dashboard/actions";

// Save a record to the watchlist. Signed-out visitors are sent to sign in and
// brought back to the same record.
export function SaveButton({ slug, initial, className = "" }: { slug: string; initial?: boolean; className?: string }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initial ?? false);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (initial !== undefined || !isSignedIn) return;
    let live = true;
    savedState(slug).then((value) => { if (live) setSaved(value); }).catch(() => {});
    return () => { live = false; };
  }, [initial, isSignedIn, slug]);

  function onClick() {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    startTransition(async () => {
      const result = await toggleSaved(slug);
      if ("saved" in result) {
        setSaved(result.saved);
        setNote(result.saved ? "Saved to your desk" : "Removed from your desk");
      } else setNote("Could not save. Try again.");
    });
  }

  return (
    <span className={`save-control ${className}`}>
      <button type="button" className="save-button" aria-pressed={saved} disabled={!isLoaded || pending} onClick={onClick}>
        <svg viewBox="0 0 16 20" aria-hidden="true"><path d="M1.5 1.5h13v17L8 13.6l-6.5 4.9z" /></svg>
        {saved ? "Saved" : "Save"}
      </button>
      <span className="save-note" role="status" aria-live="polite">{note}</span>
    </span>
  );
}
