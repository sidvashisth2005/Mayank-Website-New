"use client";

import { useMemo, useState } from "react";
import type { ShownReview } from "@/lib/server/voices";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const sorts = { newest: "Newest first", highest: "Highest rated", lowest: "Lowest rated" } as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" role="img" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((step) => <i key={step} className={step <= rating ? "is-on" : ""} aria-hidden="true" />)}
    </span>
  );
}

// Rating summary, a 5-to-1 distribution and the reviews themselves.
export function ProductReviews({ reviews, closed, name }: { reviews: ShownReview[]; closed: boolean; name: string }) {
  const [sort, setSort] = useState<keyof typeof sorts>("newest");
  const sorted = useMemo(() => [...reviews].sort((a, b) =>
    sort === "newest" ? b.date.localeCompare(a.date) : sort === "highest" ? b.rating - a.rating || b.date.localeCompare(a.date) : a.rating - b.rating || b.date.localeCompare(a.date)), [reviews, sort]);

  if (!reviews.length) {
    return (
      <div className="reviews-empty">
        <strong>No reviews yet.</strong>
        <p>Reviews open to buyers after a completed transfer or during an active licence, so every rating comes from someone who used {name}. {closed ? "" : "This record has not changed hands yet."}</p>
      </div>
    );
  }

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((review) => review.rating === star).length }));
  const most = Math.max(...counts.map((row) => row.count));
  const samples = reviews.filter((review) => review.sample).length;

  return (
    <div className="reviews">
      <div className="reviews-summary">
        <div className="reviews-score">
          <strong>{average.toFixed(1)}</strong>
          <Stars rating={Math.round(average)} />
          <span>{reviews.length} {reviews.length === 1 ? "review" : "reviews"} / {reviews.filter((review) => review.verified).length} verified</span>
        </div>
        <dl className="reviews-bars" aria-label="Rating distribution">
          {counts.map((row) => (
            <div key={row.star}>
              <dt>{row.star}</dt>
              <dd><i style={{ width: `${most ? (row.count / most) * 100 : 0}%` }} /><span>{row.count}</span></dd>
            </div>
          ))}
        </dl>
      </div>
      {samples > 0 && <p className="voices-note"><b>Sample</b> reviews are written for Edition 01 to show how buyer feedback appears on a record.</p>}
      <div className="reviews-tools">
        <label><span className="label">Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as keyof typeof sorts)}>
            {Object.entries(sorts).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
        <p>Only verified buyers can review, after the transfer completes.</p>
      </div>
      <ol className="reviews-list">
        {sorted.map((review, index) => (
          <li key={`${review.name}-${index}`}>
            <header>
              <Stars rating={review.rating} />
              <strong>{review.title}</strong>
              {review.verified && <span className="review-verified">Verified transfer</span>}
              {review.sample && <span className="sample-tag">Sample</span>}
            </header>
            <p>{review.body}</p>
            <footer><span>{review.name}, {review.role}</span><time dateTime={review.date}>{dateFormat.format(new Date(`${review.date}T00:00:00`))}</time></footer>
          </li>
        ))}
      </ol>
    </div>
  );
}
