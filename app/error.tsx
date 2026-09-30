"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main id="main" tabIndex={-1} className="state-page">
      <span className="label">Error / Something failed{error.digest ? ` / ${error.digest}` : ""}</span>
      <h1>This page did <em>not load.</em></h1>
      <p>Nothing you entered has been lost. Try again; if it keeps happening, the problem is on our side and has been logged.</p>
      <div className="state-actions">
        <button type="button" className="btn btn-solid" onClick={reset}>Try again<span>Reload this section</span></button>
        <Link className="btn btn-outline" href="/">Back to the start<span>Home</span></Link>
      </div>
    </main>
  );
}
