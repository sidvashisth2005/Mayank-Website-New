import type { ListingStatus } from "./db/schema";

// The path a member listing takes, shared by the dashboard and the review desk.

export const statusCopy: Record<ListingStatus, { label: string; tone: "open" | "wait" | "act" | "done" | "stop"; next: string }> = {
  submitted: { label: "Submitted", tone: "wait", next: "Waiting for the review desk to open it." },
  in_review: { label: "In review", tone: "wait", next: "Ownership, condition and the transfer route are being checked." },
  changes_requested: { label: "Changes requested", tone: "act", next: "The review desk needs something from you. Read the note and reply." },
  live: { label: "Live", tone: "open", next: "Published in the market. Enquiries arrive in your inbox." },
  under_offer: { label: "Under offer", tone: "open", next: "A buyer is in conversation. Mark it transferred once the handover is done." },
  transferred: { label: "Transferred", tone: "done", next: "Handed over. This record is closed." },
  declined: { label: "Declined", tone: "stop", next: "The review desk could not publish this asset. See the note." },
  withdrawn: { label: "Withdrawn", tone: "stop", next: "You withdrew this listing. It is not visible anywhere." },
};

// The progress rail shown for every listing. A paused or closed status is
// placed on the step where it happened.
export const railSteps = ["Submitted", "Review", "Live", "Offer", "Transferred"] as const;

export function railPosition(status: ListingStatus) {
  switch (status) {
    case "submitted": return 0;
    case "in_review":
    case "changes_requested":
    case "declined": return 1;
    case "live":
    case "withdrawn": return 2;
    case "under_offer": return 3;
    case "transferred": return 4;
  }
}

// Which moves each side may make from a given status.
export const deskMoves: Partial<Record<ListingStatus, ListingStatus[]>> = {
  submitted: ["in_review", "changes_requested", "live", "declined"],
  in_review: ["changes_requested", "live", "declined"],
  changes_requested: ["in_review", "live", "declined"],
  live: ["under_offer", "withdrawn"],
  under_offer: ["live", "transferred"],
};

export const sellerMoves: Partial<Record<ListingStatus, ListingStatus[]>> = {
  submitted: ["withdrawn"],
  in_review: ["withdrawn"],
  changes_requested: ["submitted", "withdrawn"],
  live: ["under_offer", "withdrawn"],
  under_offer: ["live", "transferred"],
};

export const isOpen = (status: ListingStatus) => !["transferred", "declined", "withdrawn"].includes(status);
