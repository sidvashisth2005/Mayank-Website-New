import { TransitionLink } from "@/components/mayank/PageTransition";

export const metadata = { title: "Not on file" };

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="state-page">
      <span className="label">Error 404 / No record</span>
      <h1>Not on <em>file.</em></h1>
      <p>This address does not match any record, page or listing. It may have been withdrawn, or the link was copied incompletely.</p>
      <div className="state-actions">
        <TransitionLink className="btn btn-solid" href="/market">Search the market<span>Every live record</span></TransitionLink>
        <TransitionLink className="btn btn-outline" href="/">Back to the start<span>Home</span></TransitionLink>
      </div>
    </main>
  );
}
