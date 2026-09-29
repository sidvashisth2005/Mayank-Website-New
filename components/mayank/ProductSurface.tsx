"use client";

import { useState } from "react";
import { formatAge, type Asset, type SampleVariant } from "@/lib/assets";

const views: Record<SampleVariant, [string, string, string]> = {
  analytics: ["Pulse", "Cohorts", "Accounts"],
  portal: ["Traffic", "Articles", "Search"],
  app: ["Retention", "Streaks", "Reviews"],
  domain: ["Name", "Identity", "Registrar"],
  system: ["Components", "Tokens", "States"],
  code: ["Repository", "Activity", "Tests"],
  template: ["Pages", "Sections", "Mobile"],
};

const factors = [[1, 1, 1], [0.72, 0.9, 0.8], [0.86, 0.7, 0.94]];

function Chart({ asset, view }: { asset: Asset; view: number }) {
  return (
    <>
      <div className="product-number"><span>{asset.metric.label}</span><strong>{asset.metric.value}</strong></div>
      <div className="product-bars" role="img" aria-label={`${asset.name} ${views[asset.sample][view]} sample chart`}>
        {asset.bars.map((height, index) => <i key={index} style={{ height: `${Math.max(12, height * factors[view][index % 3])}%` }} />)}
      </div>
    </>
  );
}

function DomainSample({ asset, view }: { asset: Asset; view: number }) {
  const name = asset.name.toLowerCase();
  if (view === 0) return <div className="sample-domain"><span>Registered name</span><strong>{name}<em>.com</em></strong><small>{asset.name.length} letters · {Math.ceil(asset.name.length / 4)} syllables · no hyphens</small></div>;
  if (view === 1) return (
    <div className="sample-identity">
      <strong>{asset.name}</strong><em>{asset.name}</em>
      <div>{["#101111", "#5f625e", "#b9bab5", "#ededeb"].map((tone) => <i key={tone} style={{ background: tone }}><span>{tone}</span></i>)}</div>
    </div>
  );
  return (
    <dl className="sample-registrar">
      <div><dt>Held for</dt><dd>{formatAge(asset.ageMonths)}</dd></div>
      <div><dt>Transfer lock</dt><dd>Lifted before completion</dd></div>
      <div><dt>Record status</dt><dd>{asset.review}</dd></div>
      <div><dt>Route</dt><dd>{asset.route}</dd></div>
    </dl>
  );
}

function SystemSample({ view }: { view: number }) {
  if (view === 0) return (
    <div className="sample-components">
      <span className="sc-button">Continue</span><span className="sc-button is-ghost">Cancel</span>
      <span className="sc-input">name@company.com</span><span className="sc-toggle"><i /></span>
      <span className="sc-tag">Draft</span><span className="sc-tag is-dark">Live</span>
      <span className="sc-rule" /><span className="sc-slider"><i /></span>
    </div>
  );
  if (view === 1) return (
    <div className="sample-tokens">
      {[["ink/900", "#101111"], ["ink/600", "#4c4e49"], ["stone/300", "#b9bab5"], ["paper/50", "#f7f7f5"]].map(([token, tone]) => <p key={token}><i style={{ background: tone }} /><span>{token}</span><span>{tone}</span></p>)}
      {[4, 8, 16, 24, 40].map((space) => <p key={space}><b style={{ width: space * 2.2 }} /><span>space/{space}</span><span>{space}px</span></p>)}
    </div>
  );
  return (
    <div className="sample-states">
      {["Default", "Hover", "Focus", "Disabled"].map((state) => <div key={state} className={`is-${state.toLowerCase()}`}><span className="sc-button">Continue</span><small>{state}</small></div>)}
    </div>
  );
}

function CodeSample({ asset, view }: { asset: Asset; view: number }) {
  if (view === 0) return (
    <ul className="sample-tree">
      {["src/", "  api/", "  billing/", "  render/", "sdk/typescript/", "sdk/python/", "tests/", "docs/MIGRATION.md", "README.md"].map((line) => <li key={line} className={line.endsWith("/") ? "is-dir" : ""}>{line}</li>)}
    </ul>
  );
  if (view === 1) return (
    <div className="sample-activity">
      <span>Commits per month · last 12 months</span>
      <div className="product-bars" role="img" aria-label={`${asset.name} commit activity sample`}>{asset.bars.map((height, index) => <i key={index} style={{ height: `${Math.max(10, height * 0.8)}%` }} />)}</div>
    </div>
  );
  return <Chart asset={asset} view={0} />;
}

function TemplateSample({ view }: { view: number }) {
  const count = view === 2 ? 3 : 6;
  return (
    <div className={`sample-pages${view === 2 ? " is-mobile" : ""}${view === 1 ? " is-sections" : ""}`}>
      {Array.from({ length: count }, (_, index) => <div key={index}><i /><b /><b /><em /></div>)}
    </div>
  );
}

export function ProductSurface({ asset, compact = false }: { asset: Asset; compact?: boolean }) {
  const [view, setView] = useState(0);
  const labels = views[asset.sample];
  let canvas;
  if (asset.sample === "domain") canvas = <DomainSample asset={asset} view={view} />;
  else if (asset.sample === "system") canvas = <SystemSample view={view} />;
  else if (asset.sample === "code") canvas = <CodeSample asset={asset} view={view} />;
  else if (asset.sample === "template") canvas = <TemplateSample view={view} />;
  else canvas = <Chart asset={asset} view={view} />;

  return (
    <div className={`product-surface${compact ? " is-compact" : ""}`} aria-label={`${asset.name} interactive sample`}>
      <div className="product-rail">
        <strong>{asset.name}</strong><span>{asset.id}</span>
        <div className="product-tabs" role="tablist" aria-label="Sample views">
          {labels.map((label, index) => (
            <button key={label} type="button" role="tab" aria-selected={view === index} className={view === index ? "is-active" : ""} onClick={() => setView(index)}>{label}</button>
          ))}
        </div>
        <small>Live sample</small>
      </div>
      <div className={`product-canvas sample-${asset.sample}`}>
        <div className="product-canvas-head"><span>{labels[view]}</span><span>Sample data</span></div>
        {canvas}
      </div>
    </div>
  );
}
