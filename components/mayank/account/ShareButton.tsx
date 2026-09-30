"use client";

import { useState } from "react";

// Uses the system share sheet where there is one, and copies the link otherwise.
export function ShareButton({ title }: { title: string }) {
  const [note, setNote] = useState("");
  async function share() {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNote("Link copied");
    } catch (error) {
      if ((error as Error).name !== "AbortError") setNote("Copy the address from the browser bar");
    }
  }
  return (
    <span className="save-control">
      <button type="button" className="save-button" onClick={share}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5H3.5v11.5H15V12M11 3.5h5.5V9M16.5 3.5 9 11" /></svg>
        Share
      </button>
      <span className="save-note" role="status" aria-live="polite">{note}</span>
    </span>
  );
}
