import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/mayank/EnquiryForm";
import { Gallery } from "@/components/mayank/Gallery";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { ScrollLink } from "@/components/mayank/ScrollLink";
import { ShareButton } from "@/components/mayank/account/ShareButton";
import { StickyEnquiry } from "@/components/mayank/StickyEnquiry";
import { RecordPlate } from "@/components/mayank/visuals/RecordPlate";
import { countView, memberListingPublic } from "@/lib/server/market";
import { listingPlate, memberPrice, memberRecordId } from "@/lib/member-plate";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await memberListingPublic((await params).id);
  if (!listing) return { title: "Record not found" };
  return { title: `${listing.name}, ${listing.category}`, description: listing.description.slice(0, 160) };
}

export default async function MemberListingPage({ params }: Props) {
  const listing = await memberListingPublic((await params).id);
  if (!listing) notFound();
  await countView(listing.id);
  const plate = listingPlate(listing);
  const underOffer = listing.status === "under_offer";

  const sheet: [string, string][] = [
    ["Deal", listing.dealType === "Sell" ? "Buy outright" : `Rent or licence, per ${listing.rentPeriod}`],
    ["Status", underOffer ? "Under offer" : "Available"],
    ["Asset age", listing.age],
    ["Review", "Checked by the Mayank review desk"],
    ["Transfer", listing.transfer],
  ];

  return (
    <main id="main" tabIndex={-1} className="asset-page member-page" style={{ "--accent": plate.ink } as CSSProperties}>
      <PageMotion />
      <nav className="asset-register" aria-label="Record navigation">
        <span><TransitionLink href="/market">Market</TransitionLink> / Member listings / <b>{memberRecordId(listing.recordNo)}</b></span>
        <span className="register-flag is-member">Member listing</span>
        <span>{listing.sellerCity ? `Seller in ${listing.sellerCity}` : "Seller verified by the desk"}</span>
      </nav>

      <section className="member-hero">
        <div>
          <span className="label" data-rise>{memberRecordId(listing.recordNo)} / {listing.category}</span>
          <h1 className="member-title" data-rise>{listing.name}</h1>
          <p data-rise>{listing.description}</p>
        </div>
        <RecordPlate source={plate} variant="cover" className="member-plate" />
      </section>

      <div className="asset-body">
        <div className="asset-main">
          {listing.images.length > 0 && (
            <section className="asset-section" aria-labelledby="screens-title">
              <h2 id="screens-title" className="member-subhead">Screens</h2>
              <Gallery name={listing.name} shots={listing.images.map((image) => ({ src: image.url, alt: image.alt }))} />
            </section>
          )}
          <section className="asset-section" aria-labelledby="condition-title">
            <h2 id="condition-title" className="member-subhead">Present condition</h2>
            <p className="member-copy">{listing.condition}</p>
            {listing.metrics && <><h3 className="member-subhead is-small">Metrics stated by the seller</h3><p className="member-copy">{listing.metrics}</p></>}
            {listing.dependencies && <><h3 className="member-subhead is-small">Dependencies</h3><p className="member-copy">{listing.dependencies}</p></>}
          </section>
          <section className="asset-section" id="enquire" aria-labelledby="enquire-title">
            <h2 id="enquire-title" className="member-subhead">Enquire</h2>
            <p className="member-copy">Your enquiry goes to the seller&apos;s desk. Contact details are exchanged only after the review desk introduces you.</p>
            <EnquiryForm target={{ key: `member:${listing.id}`, id: memberRecordId(listing.recordNo), closed: false, deal: listing.dealType === "Sell" ? "sell" : "rent" }} />
          </section>
        </div>

        <aside className="record-sheet" aria-label="Record sheet">
          <span className="label">Record sheet / {memberRecordId(listing.recordNo)}</span>
          <strong className="sheet-price">{memberPrice(listing)}</strong>
          <dl>{sheet.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <ScrollLink target="enquire" className="btn btn-accent btn-wide">Begin private enquiry<span>No payment taken</span></ScrollLink>
          <div className="sheet-tools"><ShareButton title={`${listing.name} on Mayank`} /></div>
          <small>Listed by {listing.sellerName}. Mayank checked identity, ownership, condition and route before publishing. It is not the seller or an escrow provider.</small>
        </aside>
      </div>
      <StickyEnquiry price={memberPrice(listing)} label="Enquire" />
    </main>
  );
}
