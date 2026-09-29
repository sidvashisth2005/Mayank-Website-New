import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/mayank/EnquiryForm";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { ProductSurface } from "@/components/mayank/ProductSurface";
import { ScrollLink } from "@/components/mayank/ScrollLink";
import { SectionNav } from "@/components/mayank/SectionNav";
import { specimenSrc } from "@/components/mayank/Specimen";
import { Chart } from "@/components/mayank/visuals/Chart";
import { Drawing } from "@/components/mayank/visuals/Drawings";
import { RecordPlate, plateFrom } from "@/components/mayank/visuals/RecordPlate";
import { assets, categoryOf, dealLabel, formatAge, formatPrice, getAsset, neighbours, recordNumber, similarTo, statusLabel } from "@/lib/assets";
import { getDossier } from "@/lib/dossiers";

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

const sections: [string, string][] = [["sample", "Sample"], ["numbers", "Numbers"], ["condition", "Condition"], ["evidence", "Evidence"], ["route", "Route"], ["seller", "Seller"], ["enquire", "Enquire"]];

export default async function AssetPage({ params }: Props) {
  const asset = getAsset((await params).slug);
  if (!asset) notFound();
  const dossier = getDossier(asset.slug);
  const { previous, next } = neighbours(asset);
  const category = categoryOf(asset.category);
  const closed = asset.status !== "live";
  const similar = similarTo(asset);
  const route = [
    ["Enquiry accepted", "Mayank introduces you privately once the seller's identity has been confirmed."],
    ["Evidence shared", asset.access + "."],
    ["Agreement", "Price, licence or assignment terms are agreed directly between buyer and seller."],
    ["Transfer", asset.route + "."],
    ["Support window", `Indicative window: ${asset.transferWindow}, including the handover.`],
  ];

  return (
    <main id="main" tabIndex={-1} className="asset-page" style={{ "--accent": category.ink } as CSSProperties}>
      <PageMotion />
      <nav className="asset-register" aria-label="Record navigation">
        <span><TransitionLink href="/market">Market</TransitionLink> / <TransitionLink href={`/market?category=${category.key}`}>{category.label}</TransitionLink> / <b data-scramble>{asset.id}</b></span>
        <span className="register-flag">Sample listing</span>
        <span>Record {recordNumber(asset)} / {String(assets.length).padStart(2, "0")}</span>
        <span className="register-step">
          <TransitionLink href={`/market/${previous.slug}`} aria-label={`Previous record, ${previous.name}`}>Previous</TransitionLink>
          <TransitionLink href={`/market/${next.slug}`} aria-label={`Next record, ${next.name}`}>Next</TransitionLink>
        </span>
      </nav>

      <section className="asset-hero">
        <div className="asset-hero-copy">
          <span className="label accent-label" data-rise>{asset.type} / {category.label}</span>
          <h1 className="cut-title"><span><span>{asset.name}</span></span></h1>
          <p data-rise>{asset.description}</p>
          <ul className="asset-highlights" data-rise>{dossier.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="asset-collage" data-crop>
          <div className="collage-photo"><Image src={specimenSrc(asset)} alt="" fill sizes="(max-width: 980px) 60vw, 26vw" style={{ objectPosition: asset.specimen.position }} /></div>
          <RecordPlate source={plateFrom(asset)} variant="cover" className="collage-plate" />
          <Drawing name={asset.category} className="collage-drawing" />
          {closed && <b className="record-stamp">{statusLabel[asset.status]}</b>}
        </div>
        <dl className="asset-facts" data-rise>
          <div><dt>{dealLabel[asset.deal]}</dt><dd>{formatPrice(asset)}</dd></div>
          <div><dt>{asset.metric.label}</dt><dd>{asset.metric.value}</dd></div>
          <div><dt>Asset age</dt><dd>{formatAge(asset.ageMonths)}</dd></div>
          <div><dt>Transfer window</dt><dd>{asset.transferWindow}</dd></div>
        </dl>
      </section>

      <SectionNav sections={sections} />

      <div className="asset-body">
        <div className="asset-main">
          <section className="asset-section" id="sample">
            <header data-reveal><span>01</span><h2>Working sample</h2><p>Switch views to see the surface you would take over. Figures are sample data.</p></header>
            <div data-tilt><ProductSurface asset={asset} /></div>
          </section>

          <section className="asset-section" id="numbers">
            <header data-reveal><span>02</span><h2>The numbers</h2><p>Twelve months of the record&apos;s main measure, with the money around it where it applies.</p></header>
            <div data-reveal><Chart values={dossier.series.values} label={dossier.series.label} /></div>
            <dl className="numbers-row" data-reveal>
              <div><dt>Revenue</dt><dd>{dossier.financials?.revenue ?? "Not applicable"}</dd></div>
              <div><dt>Running costs</dt><dd>{dossier.financials?.costs ?? "Not applicable"}</dd></div>
              <div><dt>{asset.metric.label}</dt><dd>{asset.metric.value}</dd></div>
            </dl>
            {dossier.financials && <p className="numbers-note" data-reveal>{dossier.financials.note}</p>}
          </section>

          <section className="asset-section" id="condition">
            <header data-reveal><span>03</span><h2>Condition ledger</h2><p>Written plainly: what works, what depends on someone else, and what does not come with it.</p></header>
            <div className="condition-ledger">
              {([["Works today", asset.works], ["Depends on", asset.depends], ["Not included", asset.excluded]] as const).map(([title, items]) => (
                <div key={title} data-reveal><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
              ))}
            </div>
            <h3 className="includes-title" data-reveal>What transfers</h3>
            <ol className="includes-list">
              {asset.includes.map((item, index) => <li key={item} data-reveal><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
            </ol>
          </section>

          <section className="asset-section" id="evidence">
            <header data-reveal><span>04</span><h2>Evidence on file</h2><p>What the review desk has seen. Verified items were checked; provided items were supplied by the seller.</p></header>
            <ol className="evidence-ledger">
              {dossier.evidence.map(([item, status], index) => (
                <li key={item} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><b className={`evidence-stamp is-${status.toLowerCase().replace(" ", "-")}`}>{status}</b></li>
              ))}
            </ol>
          </section>

          <section className="asset-section" id="route">
            <header data-reveal><span>05</span><h2>Transfer route</h2><p>{asset.route}. Indicative window: {asset.transferWindow}.</p></header>
            <ol className="route-line">
              <i data-rule aria-hidden="true" />
              {route.map(([title, copy], index) => <li key={title} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{copy}</p></li>)}
            </ol>
          </section>

          <section className="asset-section seller-brief" id="seller">
            <header data-reveal><span>06</span><h2>Seller brief</h2><p>Seller identity is checked privately and shared once an enquiry is accepted.</p></header>
            <div className="brief-grid">
              <dl data-reveal>
                <div><dt>Seller</dt><dd>{dossier.seller.role}</dd></div>
                <div><dt>Based in</dt><dd>{dossier.seller.city}</dd></div>
                <div><dt>Team</dt><dd>{dossier.seller.team}</dd></div>
              </dl>
              <div data-reveal>
                <h3>Why it is for sale</h3><p>{dossier.reason}</p>
                <h3>Who it suits</h3><p>{dossier.idealBuyer}</p>
                <h3>Built with</h3>
                <ul className="stack-tags">{dossier.stack.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
            <div className="asset-faq faq-list">
              {dossier.faq.map(([question, answer]) => (
                <details key={question} data-reveal><summary><span>{question}</span><i aria-hidden="true" /></summary><p>{answer}</p></details>
              ))}
            </div>
          </section>

          <section className="asset-section" id="enquire">
            <header data-reveal><span>07</span><h2>{closed ? "Ask about similar assets" : "Private enquiry"}</h2><p>{closed ? `This record is ${statusLabel[asset.status].toLowerCase()}. Tell us what you need and the review desk will reply when a comparable asset is listed.` : "Your message goes to the Mayank review desk first. Seller contact details are shared only after the enquiry is accepted."}</p></header>
            <div data-reveal><EnquiryForm asset={asset} /></div>
          </section>
        </div>

        <aside className="record-sheet" aria-label="Record sheet">
          <span className="label">Record sheet / {asset.id}</span>
          <strong className="sheet-price">{formatPrice(asset)}</strong>
          <dl>
            <div><dt>Deal</dt><dd>{dealLabel[asset.deal]}</dd></div>
            <div><dt>Status</dt><dd>{statusLabel[asset.status]}</dd></div>
            <div><dt>Asset age</dt><dd>{formatAge(asset.ageMonths)}</dd></div>
            <div><dt>Review</dt><dd>{asset.review}</dd></div>
            <div><dt>Access</dt><dd>{asset.access}</dd></div>
            <div><dt>Transfer window</dt><dd>{asset.transferWindow}</dd></div>
          </dl>
          <ScrollLink target="enquire" className="btn btn-accent btn-wide">{closed ? "Ask about similar assets" : "Begin private enquiry"}<span>{closed ? "Record closed" : "No payment taken"}</span></ScrollLink>
          <small>Mayank checks identity, ownership, condition and route before an introduction. It is not the seller or an escrow provider.</small>
        </aside>
      </div>

      <section className="similar-records" aria-labelledby="similar-title">
        <header><span className="label">On file nearby</span><h2 id="similar-title">Similar records</h2></header>
        <ul>
          {similar.map((other) => (
            <li key={other.slug} data-reveal>
              <TransitionLink href={`/market/${other.slug}`}>
                <RecordPlate source={plateFrom(other)} variant="stamp" title="" />
                <span><strong>{other.name}</strong><small>{other.type} / {formatPrice(other)}</small></span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>

      <TransitionLink className="asset-next" href={`/market/${next.slug}`} style={{ "--accent": categoryOf(next.category).ink } as CSSProperties}>
        <span>Next record / {next.id} / {next.type}</span>
        <strong>{next.name}</strong>
        <em>{formatPrice(next)}</em>
      </TransitionLink>
    </main>
  );
}
