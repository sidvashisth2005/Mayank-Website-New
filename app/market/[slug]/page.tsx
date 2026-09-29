import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/mayank/EnquiryForm";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { ProductSurface } from "@/components/mayank/ProductSurface";
import { ScrollLink } from "@/components/mayank/ScrollLink";
import { Specimen } from "@/components/mayank/Specimen";
import { assets, categoryOf, dealLabel, formatAge, formatPrice, getAsset, neighbours, recordNumber, statusLabel } from "@/lib/assets";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return assets.map((asset) => ({ slug: asset.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const asset = getAsset((await params).slug);
  if (!asset) return {};
  return { title: `${asset.name}, ${asset.type}`, description: asset.description };
}

export default async function AssetPage({ params }: Props) {
  const asset = getAsset((await params).slug);
  if (!asset) notFound();
  const { previous, next } = neighbours(asset);
  const category = categoryOf(asset.category);
  const closed = asset.status !== "live";
  const route = [
    ["Enquiry accepted", "Mayank introduces you privately once the seller's identity has been confirmed."],
    ["Evidence shared", asset.access + "."],
    ["Agreement", "Price, licence or assignment terms are agreed directly between buyer and seller."],
    ["Transfer", asset.route + "."],
    ["Support window", `Indicative window: ${asset.transferWindow}, including the handover.`],
  ];

  return (
    <main id="main" tabIndex={-1} className="asset-page">
      <PageMotion />
      <nav className="asset-register" aria-label="Record navigation">
        <span><TransitionLink href="/market">Market</TransitionLink> / <TransitionLink href={`/market?category=${category.key}`}>{category.label}</TransitionLink> / {asset.id}</span>
        <span className="register-flag">Sample listing</span>
        <span>Record {recordNumber(asset)} / {String(assets.length).padStart(2, "0")}</span>
        <span className="register-step">
          <TransitionLink href={`/market/${previous.slug}`} aria-label={`Previous record, ${previous.name}`}>Previous</TransitionLink>
          <TransitionLink href={`/market/${next.slug}`} aria-label={`Next record, ${next.name}`}>Next</TransitionLink>
        </span>
      </nav>

      <section className="asset-hero">
        <div className="asset-hero-copy">
          <span className="label" data-rise>{asset.type} / {category.label}</span>
          <h1 className="cut-title"><span><span>{asset.name}</span></span></h1>
          <p data-rise>{asset.description}</p>
        </div>
        <div className="asset-hero-specimen" data-crop>
          <Specimen asset={asset} sizes="(max-width: 980px) 90vw, 36vw" />
        </div>
      </section>

      <div className="asset-body">
        <div className="asset-main">
          <section className="asset-section" id="sample">
            <header data-reveal><span>01</span><h2>Working sample</h2><p>Switch views to see the surface you would take over. Figures are sample data.</p></header>
            <div data-reveal><ProductSurface asset={asset} /></div>
          </section>

          <section className="asset-section" id="condition">
            <header data-reveal><span>02</span><h2>Condition ledger</h2><p>Written plainly: what works, what depends on someone else, and what does not come with it.</p></header>
            <div className="condition-ledger">
              {([["Works today", asset.works], ["Depends on", asset.depends], ["Not included", asset.excluded]] as const).map(([title, items]) => (
                <div key={title} data-reveal><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
              ))}
            </div>
          </section>

          <section className="asset-section" id="includes">
            <header data-reveal><span>03</span><h2>What transfers</h2><p>Everything listed here is part of the record and moves to the buyer.</p></header>
            <ol className="includes-list">
              {asset.includes.map((item, index) => <li key={item} data-reveal><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
            </ol>
          </section>

          <section className="asset-section" id="route">
            <header data-reveal><span>04</span><h2>Transfer route</h2><p>{asset.route}. Indicative window: {asset.transferWindow}.</p></header>
            <ol className="route-line">
              <i data-rule aria-hidden="true" />
              {route.map(([title, copy], index) => <li key={title} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{copy}</p></li>)}
            </ol>
          </section>

          <section className="asset-section" id="enquire">
            <header data-reveal><span>05</span><h2>{closed ? "Ask about similar assets" : "Private enquiry"}</h2><p>{closed ? `This record is ${statusLabel[asset.status].toLowerCase()}. Tell us what you need and the review desk will reply when a comparable asset is listed.` : "Your message goes to the Mayank review desk first. Seller contact details are shared only after the enquiry is accepted."}</p></header>
            <div data-reveal><EnquiryForm asset={asset} /></div>
          </section>
        </div>

        <aside className="record-sheet" aria-label="Record sheet">
          <span className="label">Record sheet / {asset.id}</span>
          <strong className="sheet-price">{formatPrice(asset)}</strong>
          <dl>
            <div><dt>Deal</dt><dd>{dealLabel[asset.deal]}</dd></div>
            <div><dt>Status</dt><dd className={`status-dot is-${asset.status}`}>{statusLabel[asset.status]}</dd></div>
            <div><dt>Asset age</dt><dd>{formatAge(asset.ageMonths)}</dd></div>
            <div><dt>Review</dt><dd>{asset.review}</dd></div>
            <div><dt>Access</dt><dd>{asset.access}</dd></div>
            <div><dt>Transfer window</dt><dd>{asset.transferWindow}</dd></div>
          </dl>
          <ScrollLink target="enquire" className="btn btn-solid btn-wide">{closed ? "Ask about similar assets" : "Begin private enquiry"}<span>{closed ? "Record closed" : "No payment taken"}</span></ScrollLink>
          <small>Mayank checks identity, ownership, condition and route before an introduction. It is not the seller or an escrow provider.</small>
        </aside>
      </div>

      <TransitionLink className="asset-next" href={`/market/${next.slug}`}>
        <span>Next record / {next.id} / {next.type}</span>
        <strong>{next.name}</strong>
        <em>{formatPrice(next)}</em>
      </TransitionLink>
    </main>
  );
}
