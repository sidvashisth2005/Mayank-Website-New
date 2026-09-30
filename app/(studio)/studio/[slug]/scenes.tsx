import type { CSSProperties, ReactNode } from "react";
import type { Asset } from "@/lib/assets";
import type { Dossier } from "@/lib/dossiers";
import type { StudioEntry } from "@/lib/catalogue/studio";
import { AreaChart, Bars, Browser, Canvas, Card, Phone, Pill, fontOf, initials, seeded } from "./kit";

type Props = { asset: Asset; dossier: Dossier; entry: StudioEntry; view: number };

const PEOPLE = ["Ananya Rao", "Kabir Mehta", "Ishita Sen", "Rohan Das", "Meera Iyer", "Arjun Nair", "Sara Khan", "Dev Patel", "Nikita Joshi", "Vikram Shah"];
const nf = new Intl.NumberFormat("en-IN");

const DASH: Record<string, { nav: string[]; columns: string[]; row: (i: number, r: () => number) => string[]; status: [string, string][] }> = {
  kite: { nav: ["Overview", "Revenue", "Cohorts", "Accounts", "Churn", "Settings"], columns: ["Workspace", "Plan", "MRR", "Seats"], row: (i, r) => [`${PEOPLE[i].split(" ")[1]} & Co`, ["Growth", "Team", "Scale"][i % 3], `₹${nf.format(Math.round(4000 + r() * 30000))}`, String(Math.round(3 + r() * 40))], status: [["Active", "#16a34a"], ["Trial", "#d97706"], ["Churn risk", "#dc2626"]] },
  stackyard: { nav: ["Users", "Roles", "Audit log", "Imports", "Billing", "Settings"], columns: ["User", "Role", "Last seen", "Team"], row: (i) => [PEOPLE[i], ["Admin", "Editor", "Viewer"][i % 3], `${(i % 5) + 1}h ago`, ["Ops", "Finance", "Support"][i % 3]], status: [["Active", "#22c55e"], ["Invited", "#a78bfa"], ["Suspended", "#f87171"]] },
  quorum: { nav: ["Calendar", "Routing", "Booking pages", "Team", "Integrations", "Settings"], columns: ["Meeting", "Owner", "When", "Source"], row: (i) => [["Discovery call", "Demo", "Renewal", "Onboarding"][i % 4], PEOPLE[i], `${["Mon", "Tue", "Wed", "Thu", "Fri"][i % 5]} ${10 + (i % 7)}:00`, ["Website", "Email", "Ads"][i % 3]], status: [["Booked", "#2563eb"], ["Rescheduled", "#f59e0b"], ["No-show", "#dc2626"]] },
  parcelboard: { nav: ["Shipments", "Delays", "Carriers", "Notifications", "Brands", "Settings"], columns: ["AWB", "Destination", "Carrier", "ETA"], row: (i, r) => [`PB${Math.round(100000 + r() * 899999)}`, ["Pune", "Jaipur", "Kochi", "Indore", "Surat", "Nagpur"][i % 6], ["Delhivery", "Blue Dart", "Ekart", "XpressBees"][i % 4], `${(i % 4) + 1} days`], status: [["In transit", "#0ea5e9"], ["Delayed", "#ea580c"], ["Delivered", "#16a34a"]] },
  "tally-desk": { nav: ["Invoices", "Expenses", "GST", "Clients", "Reports", "Settings"], columns: ["Invoice", "Client", "Amount", "Due"], row: (i, r) => [`INV-${2400 + i}`, `${PEOPLE[i].split(" ")[0]} Studio`, `₹${nf.format(Math.round(8000 + r() * 90000))}`, `${(i % 20) + 3} Oct`], status: [["Paid", "#16a34a"], ["Sent", "#0f172a"], ["Overdue", "#dc2626"]] },
};

function Dashboard({ asset, dossier, entry, view }: Props) {
  const { brand } = entry;
  const data = DASH[asset.slug] ?? DASH.kite;
  const r = seeded(asset.slug);
  const values = dossier.series.values;
  const last = values[values.length - 1];
  const kpis: [string, string, string][] = [
    [asset.metric.label, asset.metric.value, "+12.4%"],
    [dossier.series.label.split(",")[0], nf.format(last), "+8.1%"],
    ["This week", nf.format(Math.round(last / 4.3)), "+3.2%"],
    ["Healthy", `${Math.round(86 + r() * 10)}%`, "+1.1%"],
  ];
  if (view === 2) {
    return (
      <Canvas brand={brand}>
        <div style={{ position: "absolute", left: 120, top: 250, width: 560 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: brand.accent, letterSpacing: ".04em", textTransform: "uppercase" }}>{asset.name}</div>
          <div style={{ marginTop: 18, fontSize: 64, lineHeight: 1, fontWeight: 600, letterSpacing: "-.04em", fontFamily: fontOf(brand) }}>{entry.tagline}</div>
          <div style={{ marginTop: 24, fontSize: 20, color: brand.muted, lineHeight: 1.4 }}>{asset.summary}</div>
        </div>
        <Phone brand={brand} style={{ right: 330, top: 110 }}>
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: brand.muted }}>Good morning</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{entry.views[0]}</div>
            <Card brand={brand} style={{ marginTop: 16, padding: 14 }}><div style={{ fontSize: 12, color: brand.muted }}>{kpis[0][0]}</div><div style={{ fontSize: 30, fontWeight: 700 }}>{kpis[0][1]}</div><div style={{ marginTop: 8 }}><AreaChart values={values} brand={brand} width={240} height={90} /></div></Card>
            {data.status.map(([label, color], i) => <div key={label} style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}><span>{data.row(i, r)[0]}</span><Pill brand={brand} color={color}>{label}</Pill></div>)}
          </div>
        </Phone>
        <Phone brand={brand} width={280} style={{ right: 90, top: 250 }}>
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{entry.views[1]}</div>
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ padding: "12px 0", borderBottom: `1px solid ${brand.dark ? "#2a2e35" : "#eee"}`, fontSize: 13 }}><b>{data.row(i, r)[0]}</b><div style={{ color: brand.muted }}>{data.row(i, r)[2]}</div></div>)}
          </div>
        </Phone>
      </Canvas>
    );
  }
  return (
    <Canvas brand={brand}>
      <Browser brand={brand} url={`app.${asset.slug}.io/${view === 0 ? "overview" : data.nav[1].toLowerCase()}`}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", height: "100%", fontFamily: fontOf(brand) === "var(--mono)" ? "var(--display)" : fontOf(brand) }}>
          <aside style={{ background: brand.dark ? "#16191d" : "#fafaf8", borderRight: `1px solid ${brand.dark ? "#2a2e35" : "#ececea"}`, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 18 }}><i style={{ width: 26, height: 26, borderRadius: 7, background: brand.accent }} />{asset.name}</div>
            <nav style={{ marginTop: 30, display: "grid", gap: 4 }}>{data.nav.map((item, i) => <span key={item} style={{ padding: "9px 12px", borderRadius: 8, fontSize: 14, background: i === view ? (brand.dark ? "#23272e" : "#ecedf2") : "transparent", color: i === view ? brand.ink : brand.muted, fontWeight: i === view ? 600 : 400 }}>{item}</span>)}</nav>
          </aside>
          <main style={{ padding: "26px 32px", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 13, color: brand.muted }}>{entry.tagline}</div><div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.02em" }}>{entry.views[view]}</div></div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ padding: "8px 14px", border: `1px solid ${brand.dark ? "#2a2e35" : "#e2e2de"}`, borderRadius: 8, fontSize: 13, color: brand.muted }}>Last 12 months</span><span style={{ width: 34, height: 34, borderRadius: 17, background: brand.accent2, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: "#111" }}>{initials(PEOPLE[0])}</span></div>
            </div>
            {view === 0 ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 24 }}>
                  {kpis.map(([label, value, delta]) => <Card key={label} brand={brand}><div style={{ fontSize: 13, color: brand.muted, textTransform: "capitalize" }}>{label}</div><div style={{ fontSize: 30, fontWeight: 700, marginTop: 6 }}>{value}</div><div style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>{delta}</div></Card>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16, marginTop: 16 }}>
                  <Card brand={brand}><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{dossier.series.label}</div><AreaChart values={values} brand={brand} width={640} height={230} /></Card>
                  <Card brand={brand}><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Breakdown</div><Bars values={values.slice(-7)} brand={brand} width={330} height={150} color={brand.accent2} />{data.status.map(([label, color], i) => <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 12 }}><span style={{ display: "flex", gap: 8, alignItems: "center" }}><i style={{ width: 8, height: 8, borderRadius: 4, background: color }} />{label}</span><b>{Math.round(60 - i * 22 + r() * 8)}%</b></div>)}</Card>
                </div>
              </>
            ) : (
              <Card brand={brand} style={{ marginTop: 24, padding: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 130px", padding: "14px 20px", fontSize: 12, color: brand.muted, borderBottom: `1px solid ${brand.dark ? "#2a2e35" : "#ececea"}`, textTransform: "uppercase", letterSpacing: ".05em" }}>{[...data.columns, "Status"].map((c) => <span key={c}>{c}</span>)}</div>
                {Array.from({ length: 10 }, (_, i) => { const row = data.row(i, r); const [label, color] = data.status[i % 3]; return <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 130px", padding: "15px 20px", fontSize: 14, alignItems: "center", borderBottom: `1px solid ${brand.dark ? "#23272e" : "#f1f1ee"}` }}>{row.map((cell, j) => <span key={j} style={{ fontWeight: j === 0 ? 600 : 400, color: j === 0 ? brand.ink : brand.muted }}>{cell}</span>)}<span><Pill brand={brand} color={color}>{label}</Pill></span></div>; })}
              </Card>
            )}
          </main>
        </div>
      </Browser>
    </Canvas>
  );
}

function Portal({ asset, entry, view }: Props) {
  const { brand } = entry;
  const topics = ["Getting started", "Billing and plans", "Publishing", "Integrations", "Account security", "Troubleshooting"];
  const articles = ["Publish your first article", "Invite writers to a workspace", "Schedule a review", "Connect your domain", "Export search analytics", "Set up single sign-on"];
  if (view === 2) {
    return (
      <Canvas brand={brand}>
        <div style={{ position: "absolute", left: 130, top: 300, width: 600 }}><div style={{ fontSize: 58, fontWeight: 650, letterSpacing: "-.04em", lineHeight: 1 }}>{entry.tagline}</div><div style={{ fontSize: 20, color: brand.muted, marginTop: 20 }}>Search that answers before the ticket is filed.</div></div>
        <Phone brand={brand} style={{ right: 220, top: 95 }}><div style={{ padding: 20 }}><div style={{ padding: "12px 14px", border: `2px solid ${brand.accent}`, borderRadius: 10, fontSize: 15 }}>reset passw|</div>{articles.slice(0, 5).map((a, i) => <div key={a} style={{ padding: "14px 2px", borderBottom: "1px solid #eee" }}><div style={{ fontSize: 15, fontWeight: 600 }}>{a}</div><div style={{ fontSize: 12, color: brand.muted, marginTop: 3 }}>{topics[i]} · {3 + i} min read</div></div>)}</div></Phone>
      </Canvas>
    );
  }
  return (
    <Canvas brand={brand}>
      <Browser brand={brand} url={`help.${asset.slug}.app${view === 1 ? "/articles/publish-your-first-article" : ""}`}>
        {view === 0 ? (
          <div>
            <div style={{ background: brand.accent, color: "#fff", padding: "70px 0 80px", textAlign: "center" }}><div style={{ fontSize: 46, fontWeight: 650, letterSpacing: "-.03em" }}>{entry.tagline}</div><div style={{ margin: "26px auto 0", width: 620, padding: "18px 22px", borderRadius: 12, background: "#fff", color: brand.muted, fontSize: 17, textAlign: "left" }}>Search 1,284 articles</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, padding: "40px 90px" }}>{topics.map((t, i) => <Card key={t} brand={brand}><div style={{ width: 36, height: 36, borderRadius: 10, background: `${brand.accent}1f`, marginBottom: 14 }} /><div style={{ fontSize: 18, fontWeight: 650 }}>{t}</div><div style={{ fontSize: 14, color: brand.muted, marginTop: 6 }}>{8 + i * 3} articles</div></Card>)}</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 240px", gap: 40, padding: "40px 60px" }}>
            <div style={{ fontSize: 14, lineHeight: 2.2, color: brand.muted }}>{topics.map((t) => <div key={t}>{t}</div>)}</div>
            <div><div style={{ fontSize: 13, color: brand.accent, fontWeight: 600 }}>Publishing</div><div style={{ fontSize: 38, fontWeight: 650, letterSpacing: "-.03em", marginTop: 8 }}>{articles[0]}</div><p style={{ fontSize: 17, lineHeight: 1.7, color: brand.muted }}>Drafts move through review before they go live. Assign a reviewer, add a publish date and your article appears in search within a minute of approval.</p>{[1, 2, 3].map((n) => <div key={n} style={{ display: "flex", gap: 14, marginTop: 18 }}><b style={{ width: 30, height: 30, borderRadius: 15, background: brand.accent, color: "#fff", display: "grid", placeItems: "center", fontSize: 14 }}>{n}</b><div style={{ fontSize: 16, lineHeight: 1.6 }}>{["Open the article and choose Request review.", "Pick a reviewer from your workspace.", "Approve, schedule and publish."][n - 1]}</div></div>)}</div>
            <Card brand={brand}><div style={{ fontSize: 13, fontWeight: 600 }}>On this page</div>{["Before you start", "Request review", "Schedule", "Publish"].map((h) => <div key={h} style={{ fontSize: 13, color: brand.muted, marginTop: 10 }}>{h}</div>)}</Card>
          </div>
        )}
      </Browser>
    </Canvas>
  );
}

function Mobile({ asset, dossier, entry, view }: Props) {
  const { brand } = entry;
  const grocery = asset.slug === "pantry-pal";
  const items = grocery ? ["Oats", "Bananas", "Paneer", "Coffee beans", "Dishwash liquid", "Basmati rice"] : ["Morning walk", "Read 20 pages", "No phone after 10", "Drink water", "Stretch", "Journal"];
  const screen = (kind: number) => (
    <div style={{ padding: 20 }}>
      <div style={{ fontSize: 13, color: brand.muted }}>{grocery ? "Shared with 3" : "Tuesday"}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 2 }}>{entry.views[kind]}</div>
      {kind === 1 ? (
        <div style={{ marginTop: 30, display: "grid", placeItems: "center" }}>
          <svg width={200} height={200}><circle cx={100} cy={100} r={80} fill="none" stroke={`${brand.accent}33`} strokeWidth={18} /><circle cx={100} cy={100} r={80} fill="none" stroke={brand.accent} strokeWidth={18} strokeDasharray={`${2 * Math.PI * 80 * 0.72} 999`} transform="rotate(-90 100 100)" strokeLinecap="round" /><text x={100} y={112} textAnchor="middle" fontSize={40} fontWeight={700} fill={brand.ink}>{grocery ? "3" : "24"}</text></svg>
          <div style={{ fontSize: 15, color: brand.muted, marginTop: 10 }}>{grocery ? "people in this household" : "day streak"}</div>
          <div style={{ marginTop: 22, width: "100%" }}><Bars values={dossier.series.values.slice(-7)} brand={brand} width={270} height={90} /></div>
        </div>
      ) : items.map((item, i) => (
        <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #eee" }}>
          <i style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${brand.accent}`, background: i < 2 ? brand.accent : "transparent" }} />
          <span style={{ fontSize: 16, textDecoration: i < 2 ? "line-through" : "none", color: i < 2 ? brand.muted : brand.ink }}>{item}</span>
          {grocery && <span style={{ marginLeft: "auto", fontSize: 12, color: brand.muted }}>{["Asha", "Dev", "Asha", "Meera", "Dev", "Meera"][i]}</span>}
        </div>
      ))}
    </div>
  );
  if (view === 1) {
    return (
      <Canvas brand={brand}>
        <div style={{ position: "absolute", left: 140, top: 280, width: 620 }}><div style={{ fontSize: 16, fontWeight: 700, color: brand.accent, textTransform: "uppercase", letterSpacing: ".06em" }}>{asset.name}</div><div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1, marginTop: 16 }}>{entry.tagline}</div><div style={{ fontSize: 22, color: brand.muted, marginTop: 22 }}>{asset.metric.value} {asset.metric.label}</div></div>
        <Phone brand={brand} width={360} style={{ right: 200, top: 70, transform: "rotate(4deg)" }}>{screen(1)}</Phone>
      </Canvas>
    );
  }
  return (
    <Canvas brand={brand}>
      {[0, 1, 2].map((i) => <Phone key={i} brand={brand} style={{ left: 170 + i * 440, top: i === 1 ? 70 : 150 }}>{view === 2 && i === 2 ? (
        <div style={{ padding: 20 }}><div style={{ fontSize: 26, fontWeight: 700 }}>{entry.views[2]}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>{[0, 1, 2, 3].map((w) => <div key={w} style={{ aspectRatio: "1", borderRadius: 20, background: w % 2 ? brand.accent : brand.bg, color: w % 2 ? "#fff" : brand.ink, padding: 14, fontWeight: 700, fontSize: 22 }}>{grocery ? ["6", "₹840", "3", "2"][w] : ["24", "7/7", "5", "2L"][w]}<div style={{ fontSize: 11, fontWeight: 500, marginTop: 4 }}>{grocery ? ["items left", "this week", "members", "lists"][w] : ["streak", "this week", "habits", "water"][w]}</div></div>)}</div></div>
      ) : screen(i === 2 ? 0 : i)}</Phone>)}
    </Canvas>
  );
}

function Identity({ asset, entry, view }: Props) {
  const { brand } = entry;
  const word = asset.name.toLowerCase();
  const tld = asset.slug === "brightline" ? ".co" : asset.slug === "tamarind" ? ".in" : ".com";
  const Symbol = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {asset.slug === "northstar" && <path d="M50 4 L58 42 L96 50 L58 58 L50 96 L42 58 L4 50 L42 42 Z" fill={color} />}
      {asset.slug === "fernway" && <path d="M50 92 C50 60 30 40 12 34 C34 30 48 44 50 60 C52 40 64 22 88 14 C70 32 56 52 50 92 Z" fill={color} />}
      {asset.slug === "brightline" && <><rect x={10} y={44} width={80} height={12} fill={color} /><rect x={62} y={20} width={12} height={60} fill={color} transform="rotate(35 68 50)" /></>}
      {asset.slug === "tamarind" && <><ellipse cx={50} cy={50} rx={40} ry={18} fill="none" stroke={color} strokeWidth={9} transform="rotate(-30 50 50)" /><circle cx={50} cy={50} r={8} fill={color} /></>}
    </svg>
  );
  if (view === 2) {
    return (
      <Canvas brand={{ ...brand, bg: "#e9e9e6" }}>
        <Browser brand={{ ...brand, dark: false }} url={`${word}${tld}`}>
          <div style={{ height: "100%", background: brand.bg, color: brand.surface, display: "grid", placeItems: "center", textAlign: "center" }}><div><Symbol size={120} color={brand.accent} /><div style={{ fontFamily: fontOf(brand), fontSize: 110, letterSpacing: "-.03em", marginTop: 20 }}>{asset.name}</div><div style={{ fontSize: 22, opacity: 0.75, marginTop: 10 }}>{entry.tagline}. Launching soon.</div></div></div>
        </Browser>
      </Canvas>
    );
  }
  if (view === 1) {
    return (
      <Canvas brand={{ ...brand, bg: "#d8d4cb" }}>
        <div style={{ position: "absolute", left: 130, top: 170, width: 700, height: 520, background: brand.surface, padding: 60, transform: "rotate(-3deg)" }}><div style={{ display: "flex", alignItems: "center", gap: 16, color: brand.ink }}><Symbol size={50} color={brand.ink} /><span style={{ fontFamily: fontOf(brand), fontSize: 34 }}>{asset.name}</span></div>{[0, 1, 2, 3, 4, 5].map((l) => <div key={l} style={{ height: 10, background: `${brand.ink}18`, marginTop: l === 0 ? 70 : 18, width: `${90 - l * 9}%` }} />)}<div style={{ position: "absolute", bottom: 40, left: 60, fontSize: 14, color: brand.muted }}>hello@{word}{tld}</div></div>
        <div style={{ position: "absolute", right: 170, top: 230, width: 460, height: 270, background: brand.bg, color: brand.surface, padding: 36, transform: "rotate(4deg)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}><Symbol size={64} color={brand.accent} /><div><div style={{ fontFamily: fontOf(brand), fontSize: 34 }}>{asset.name}</div><div style={{ fontSize: 14, opacity: 0.8 }}>{word}{tld}</div></div></div>
        <div style={{ position: "absolute", right: 260, bottom: 120, width: 170, height: 170, borderRadius: 40, background: brand.accent, display: "grid", placeItems: "center", transform: "rotate(-6deg)" }}><Symbol size={100} color={brand.bg} /></div>
      </Canvas>
    );
  }
  return (
    <Canvas brand={brand} style={{ color: brand.surface }}>
      <div style={{ position: "absolute", left: 110, top: 110, display: "flex", alignItems: "center", gap: 40 }}><Symbol size={170} color={brand.accent} /><div style={{ fontFamily: fontOf(brand), fontSize: 170, letterSpacing: "-.04em", lineHeight: 0.9 }}>{asset.name}</div></div>
      <div style={{ position: "absolute", left: 110, top: 380, fontSize: 30, opacity: 0.8 }}>{entry.tagline}</div>
      <div style={{ position: "absolute", left: 110, right: 110, bottom: 110, display: "grid", gridTemplateColumns: "repeat(4, 1fr) 1.6fr", gap: 18 }}>
        {[brand.bg, brand.accent, brand.surface, brand.muted].map((c, i) => <div key={i} style={{ height: 220, background: c, border: "1px solid rgba(255,255,255,.25)", padding: 16, display: "flex", alignItems: "flex-end", fontSize: 14, color: i === 2 ? brand.ink : "#fff" }}>{c.toUpperCase()}</div>)}
        <div style={{ height: 220, background: brand.surface, color: brand.ink, padding: 24 }}><div style={{ fontFamily: fontOf(brand), fontSize: 64, lineHeight: 1 }}>Aa</div><div style={{ fontSize: 15, color: brand.muted, marginTop: 12 }}>Display {brand.font === "serif" ? "serif" : "sans"} · Text sans</div><div style={{ fontSize: 15, marginTop: 8 }}>{word}{tld}</div></div>
      </div>
    </Canvas>
  );
}

function Components({ asset, dossier, entry, view }: Props) {
  const { brand } = entry;
  const line = brand.dark ? "#2a2e35" : "#e4e4e0";
  const Btn = ({ kind, children }: { kind: 0 | 1 | 2; children: ReactNode }) => <span style={{ display: "inline-block", padding: "12px 20px", borderRadius: 8, fontSize: 15, fontWeight: 600, background: kind === 0 ? brand.accent : "transparent", color: kind === 0 ? "#fff" : brand.ink, border: kind === 1 ? `1px solid ${line}` : "1px solid transparent", textDecoration: kind === 2 ? "underline" : "none" }}>{children}</span>;
  const Field = ({ label, value, error }: { label: string; value: string; error?: string }) => <div><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{label}</div><div style={{ padding: "12px 14px", borderRadius: 8, border: `1.5px solid ${error ? "#dc2626" : line}`, fontSize: 15, color: value ? brand.ink : brand.muted, background: brand.surface }}>{value || "Placeholder"}</div>{error && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>{error}</div>}</div>;
  const header = <div style={{ position: "absolute", left: 90, top: 70, right: 90, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-.03em" }}>{entry.tagline}</div><div style={{ fontSize: 15, color: brand.muted }}>{entry.views[view]} · v2.4</div></div>;
  if (view === 1) {
    return (
      <Canvas brand={brand}>{header}
        <div style={{ position: "absolute", left: 90, right: 90, top: 170 }}>
          {[brand.accent, brand.accent2, brand.ink].map((base, row) => <div key={row} style={{ display: "grid", gridTemplateColumns: "140px repeat(9, 1fr)", gap: 8, marginBottom: 14, alignItems: "center" }}><span style={{ fontSize: 14, color: brand.muted }}>{["primary", "secondary", "neutral"][row]}</span>{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ height: 70, borderRadius: 8, background: base, opacity: 0.15 + i * 0.105 }} />)}</div>)}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 40 }}>
            <div>{[48, 36, 28, 20, 16, 14].map((s) => <div key={s} style={{ display: "flex", alignItems: "baseline", gap: 20, borderBottom: `1px solid ${line}`, padding: "8px 0" }}><span style={{ width: 70, fontSize: 13, color: brand.muted }}>{s}px</span><span style={{ fontSize: s, fontWeight: 600, fontFamily: fontOf(brand) }}>{asset.name}</span></div>)}</div>
            <div>{[4, 8, 12, 16, 24, 32, 48].map((s) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 20, padding: "9px 0" }}><span style={{ width: 90, fontSize: 13, color: brand.muted }}>space-{s}</span><i style={{ width: s * 6, height: 14, background: brand.accent, opacity: 0.7 }} /></div>)}</div>
          </div>
        </div>
      </Canvas>
    );
  }
  if (view === 2 && asset.slug === "tessellate") {
    const v = dossier.series.values;
    return (
      <Canvas brand={brand}>{header}
        <div style={{ position: "absolute", left: 90, right: 90, top: 170, display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
          <Card brand={brand}><div style={{ fontWeight: 600, marginBottom: 16 }}>Area · line</div><AreaChart values={v} brand={brand} width={760} height={260} /></Card>
          <Card brand={brand}><div style={{ fontWeight: 600, marginBottom: 16 }}>Bars</div><Bars values={v} brand={brand} width={420} height={260} color={brand.accent2} /></Card>
          <Card brand={brand} style={{ gridColumn: "1 / -1" }}><div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>{["#7dd3a8", "#f0a868", "#7aa2f7", "#e879a8", "#c3a6ff", "#f7d774"].map((c, i) => <div key={c}><div style={{ height: 60, background: c, borderRadius: 6 }} /><div style={{ fontSize: 12, color: brand.muted, marginTop: 8 }}>series-{i + 1}</div></div>)}</div></Card>
        </div>
      </Canvas>
    );
  }
  if (view === 2 && asset.slug === "relay") {
    const states: [string, CSSProperties][] = [
      ["Default", {}],
      ["Hover", { filter: "brightness(.88)" }],
      ["Focus", { outline: `3px solid ${brand.accent2}`, outlineOffset: 3 }],
      ["Pressed", { transform: "translateY(1px)", filter: "brightness(.78)" }],
      ["Loading", { opacity: 0.8 }],
      ["Disabled", { opacity: 0.35 }],
    ];
    return (
      <Canvas brand={brand}>{header}
        <div style={{ position: "absolute", left: 90, right: 90, top: 170, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {states.map(([label, style]) => (
            <Card key={label} brand={brand} style={{ padding: 30 }}>
              <div style={{ fontSize: 13, color: brand.muted, marginBottom: 22, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ display: "inline-block", padding: "13px 22px", borderRadius: 8, fontSize: 16, fontWeight: 600, background: brand.accent, color: "#fff", ...style }}>{label === "Loading" ? "Saving…" : "Save changes"}</span>
                <span style={{ display: "inline-block", padding: "12px 20px", borderRadius: 8, fontSize: 16, border: `1.5px solid ${line}`, ...style }}>Cancel</span>
              </div>
              <div style={{ marginTop: 22, padding: "12px 14px", borderRadius: 8, border: `1.5px solid ${label === "Focus" ? brand.accent : line}`, fontSize: 15, color: brand.muted, ...(label === "Disabled" ? { opacity: 0.35 } : {}) }}>relay@team.design</div>
            </Card>
          ))}
        </div>
      </Canvas>
    );
  }
  if (view === 2 && asset.slug === "fieldnotes") {
    return (
      <Canvas brand={brand}>{header}
        <Card brand={brand} style={{ position: "absolute", left: 360, right: 360, top: 170, padding: 40 }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>Shipping details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 26 }}><Field label="First name" value="Meera" /><Field label="Last name" value="Iyer" /><div style={{ gridColumn: "1 / -1" }}><Field label="Email" value="meera@studio" error="Enter a full email address, like name@example.com" /></div><Field label="PIN code" value="560001" /><Field label="City" value="Bengaluru" /></div>
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}><Btn kind={0}>Continue to payment</Btn><Btn kind={1}>Back</Btn></div>
        </Card>
      </Canvas>
    );
  }
  return (
    <Canvas brand={brand}>{header}
      <div style={{ position: "absolute", left: 90, right: 90, top: 170, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        <Card brand={brand}><div style={{ fontSize: 13, color: brand.muted, marginBottom: 16 }}>Buttons</div><div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}><Btn kind={0}>Save changes</Btn><Btn kind={1}>Cancel</Btn><Btn kind={2}>Learn more</Btn></div></Card>
        <Card brand={brand}><div style={{ fontSize: 13, color: brand.muted, marginBottom: 16 }}>Inputs</div><Field label="Workspace" value={`${asset.name} team`} /></Card>
        <Card brand={brand}><div style={{ fontSize: 13, color: brand.muted, marginBottom: 16 }}>Controls</div><div style={{ display: "flex", gap: 20, alignItems: "center" }}><span style={{ width: 52, height: 30, borderRadius: 15, background: brand.accent, position: "relative" }}><i style={{ position: "absolute", right: 3, top: 3, width: 24, height: 24, borderRadius: 12, background: "#fff" }} /></span><span style={{ width: 24, height: 24, borderRadius: 6, background: brand.accent }} /><span style={{ width: 24, height: 24, borderRadius: 12, border: `7px solid ${brand.accent}` }} /></div></Card>
        <Card brand={brand}><div style={{ fontSize: 13, color: brand.muted, marginBottom: 16 }}>Tabs</div><div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${line}` }}>{["Overview", "Activity", "Settings"].map((t, i) => <span key={t} style={{ paddingBottom: 10, fontSize: 15, fontWeight: 600, borderBottom: i === 0 ? `2px solid ${brand.accent}` : "none", color: i === 0 ? brand.ink : brand.muted }}>{t}</span>)}</div></Card>
        <Card brand={brand}><div style={{ fontSize: 13, color: brand.muted, marginBottom: 16 }}>Badges</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Pill brand={brand} color={brand.accent}>New</Pill><Pill brand={brand} color="#16a34a">Paid</Pill><Pill brand={brand} color="#d97706">Pending</Pill><Pill brand={brand} color="#dc2626">Failed</Pill></div></Card>
        <Card brand={brand}><div style={{ fontSize: 13, color: brand.muted, marginBottom: 16 }}>Avatars</div><div style={{ display: "flex" }}>{PEOPLE.slice(0, 5).map((p, i) => <span key={p} style={{ width: 42, height: 42, borderRadius: 21, marginLeft: i ? -10 : 0, border: `3px solid ${brand.surface}`, background: [brand.accent, brand.accent2, "#e8b86a", "#7aa2f7", "#9ca3af"][i], color: "#fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700 }}>{initials(p)}</span>)}</div></Card>
        <Card brand={brand} style={{ gridColumn: "span 2" }}><div style={{ padding: "14px 16px", borderRadius: 10, background: `${brand.accent}14`, borderLeft: `4px solid ${brand.accent}`, fontSize: 15 }}><b>Heads up.</b> Your trial ends in 3 days. Add a payment method to keep your workspace.</div></Card>
        <Card brand={brand}><div style={{ fontSize: 13, color: brand.muted, marginBottom: 12 }}>Progress</div>{[72, 45, 90].map((p) => <div key={p} style={{ height: 8, borderRadius: 4, background: `${brand.accent}22`, marginTop: 12 }}><div style={{ width: `${p}%`, height: 8, borderRadius: 4, background: brand.accent }} /></div>)}</Card>
      </div>
    </Canvas>
  );
}

function Code({ asset, dossier, entry, view }: Props) {
  const { brand } = entry;
  const signal = asset.slug === "signalkit";
  const k = (text: string) => <span style={{ color: brand.accent }}>{text}</span>;
  const s = (text: string) => <span style={{ color: "#a3d977" }}>{text}</span>;
  const c = (text: string) => <span style={{ color: brand.muted }}>{text}</span>;
  const f = (text: string) => <span style={{ color: brand.accent2 }}>{text}</span>;
  const lines: ReactNode[] = signal
    ? [<>{k("import")} {"{ createClient }"} {k("from")} {s(`"@signalkit/node"`)};</>, <></>, <>{k("const")} flags = {f("createClient")}({"{"} sdkKey: process.env.SIGNALKIT_KEY {"}"});</>, <></>, <>{c("// Roll the new checkout out to 25% of Pro teams")}</>, <>{k("const")} enabled = {k("await")} flags.{f("isEnabled")}({s(`"new-checkout"`)}, {"{"}</>, <>{"  "}key: team.id,</>, <>{"  "}plan: team.plan,</>, <>{"}"});</>, <></>, <>{k("if")} (enabled) {f("renderCheckoutV2")}();</>]
    : [<>{k("import")} {"{ Ledgerline }"} {k("from")} {s(`"@ledgerline/sdk"`)};</>, <></>, <>{k("const")} ledger = {k("new")} {f("Ledgerline")}(process.env.LEDGERLINE_KEY);</>, <></>, <>{c("// Create a GST invoice with two line items")}</>, <>{k("const")} invoice = {k("await")} ledger.invoices.{f("create")}({"{"}</>, <>{"  "}customer: {s(`"cus_8Hq2"`)},</>, <>{"  "}gstin: {s(`"29ABCDE1234F1Z5"`)},</>, <>{"  "}items: [{"{"} description: {s(`"Annual licence"`)}, amount: {f("42000")} {"}"}],</>, <>{"}"});</>, <></>, <>console.{f("log")}(invoice.pdfUrl);</>];
  if (view === 1) {
    return (
      <Canvas brand={brand}>
        <Browser brand={brand} url={signal ? "console.signalkit.dev/flags" : "docs.ledgerline.dev/api/invoices"}>
          {signal ? (
            <div style={{ padding: "30px 40px", fontFamily: "var(--display)" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>Flags <span style={{ fontSize: 15, color: brand.muted, fontWeight: 400 }}>production</span></div>
              <Card brand={brand} style={{ marginTop: 22, padding: 0 }}>{["new-checkout", "search-v3", "dark-mode", "bulk-export", "ai-summaries", "team-billing", "fast-sync", "beta-reports"].map((flag, i) => <div key={flag} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 80px", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid #2a2e35", fontSize: 15 }}><span style={{ fontFamily: "var(--mono)" }}>{flag}</span><span style={{ color: brand.muted }}>{[25, 100, 50, 0, 10, 100, 75, 5][i]}% rollout</span><span style={{ color: brand.muted }}>{PEOPLE[i]}</span><span style={{ width: 46, height: 26, borderRadius: 13, background: i === 3 ? "#3a3f47" : brand.accent, position: "relative" }}><i style={{ position: "absolute", top: 3, [i === 3 ? "left" : "right"]: 3, width: 20, height: 20, borderRadius: 10, background: "#fff" }} /></span></div>)}</Card>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 1fr", height: "100%", fontFamily: "var(--display)" }}>
              <div style={{ padding: 24, borderRight: "1px solid #2a2e35", fontSize: 14, lineHeight: 2.3, color: brand.muted }}>{["Authentication", "Invoices", "Credit notes", "Customers", "Tax summaries", "Webhooks", "Errors"].map((item, i) => <div key={item} style={{ color: i === 1 ? brand.accent : brand.muted }}>{item}</div>)}</div>
              <div style={{ padding: 32 }}><div style={{ fontSize: 13, color: brand.accent, fontFamily: "var(--mono)" }}>POST /v1/invoices</div><div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>Create an invoice</div><p style={{ fontSize: 16, color: brand.muted, lineHeight: 1.6 }}>Creates a GST-compliant invoice, assigns the next number in the series and renders a PDF.</p>{["customer", "gstin", "items", "due_date"].map((p) => <div key={p} style={{ padding: "12px 0", borderBottom: "1px solid #2a2e35" }}><span style={{ fontFamily: "var(--mono)", fontSize: 14 }}>{p}</span> <span style={{ fontSize: 12, color: brand.muted }}>{p === "due_date" ? "optional" : "required"}</span></div>)}</div>
              <div style={{ background: "#0c0e11", padding: 28, fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.8 }}>{c("// Response 201")}<pre style={{ margin: 0, color: brand.ink }}>{`{\n  "id": "inv_4Kx9",\n  "number": "LL/26-27/0412",\n  "total": 49560,\n  "tax": { "cgst": 3780, "sgst": 3780 },\n  "pdf_url": "https://..."\n}`}</pre></div>
            </div>
          )}
        </Browser>
      </Canvas>
    );
  }
  return (
    <Canvas brand={brand}>
      <Browser brand={brand} url={`github.com/${asset.slug}/${asset.slug}`}>
        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", height: "100%", fontFamily: "var(--mono)" }}>
          <div style={{ padding: 20, borderRight: "1px solid #2a2e35", fontSize: 13, lineHeight: 2.1, color: brand.muted }}>{["src/", "  client.ts", "  flags.ts", "  rollout.ts", "sdk/", "  node/", "  python/", "  go/", "tests/", "README.md"].map((file, i) => <div key={i} style={{ whiteSpace: "pre", color: i === 2 ? brand.ink : brand.muted }}>{file}</div>)}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, padding: "22px 28px", fontSize: 16, lineHeight: 1.85 }}>{(view === 2 ? lines.slice(0, 7) : lines).map((line, i) => <div key={i} style={{ display: "flex", gap: 22 }}><span style={{ width: 24, textAlign: "right", color: "#4b515b" }}>{i + 1}</span><span style={{ whiteSpace: "pre" }}>{line}</span></div>)}</div>
            <div style={{ height: view === 2 ? 420 : 250, background: "#0c0e11", borderTop: "1px solid #2a2e35", padding: "18px 28px", fontSize: 14, lineHeight: 1.9 }}>
              <div style={{ color: brand.muted }}>$ npm test</div>
              {[`✓ ${signal ? "rollout honours percentage" : "creates invoice with GST"} (12 ms)`, `✓ ${signal ? "targets by plan" : "numbers invoices in series"} (4 ms)`, `✓ ${signal ? "audit log records change" : "renders PDF"} (31 ms)`, `✓ webhook retries on failure (8 ms)`].map((t) => <div key={t} style={{ color: "#a3d977" }}>{t}</div>)}
              <div style={{ marginTop: 6 }}>Tests: <b style={{ color: "#a3d977" }}>{asset.metric.label.includes("tests") ? asset.metric.value : "412"} passed</b>, 0 failed</div>
              {view === 2 && <div style={{ marginTop: 18 }}><Bars values={dossier.series.values} brand={brand} width={1100} height={170} /></div>}
            </div>
          </div>
        </div>
      </Browser>
    </Canvas>
  );
}

function Landing({ asset, entry, view }: Props) {
  const { brand } = entry;
  const page = (
    <div style={{ fontFamily: "var(--display)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 60px" }}><b style={{ fontSize: 20 }}>Northwind</b><div style={{ display: "flex", gap: 30, fontSize: 15, color: brand.muted }}><span>Product</span><span>Customers</span><span>Pricing</span></div><span style={{ padding: "10px 18px", borderRadius: 8, background: brand.accent, color: "#fff", fontSize: 14, fontWeight: 600 }}>Start free</span></div>
      <div style={{ textAlign: "center", padding: "70px 0 50px" }}><Pill brand={brand} color={brand.accent}>New · Team workspaces</Pill><div style={{ fontSize: 68, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1, margin: "24px auto 0", maxWidth: 900 }}>{entry.tagline}</div><div style={{ fontSize: 20, color: brand.muted, marginTop: 22 }}>The launch page your product deserves, ready in an afternoon.</div></div>
      <div style={{ margin: "0 auto", width: 1000, height: 330, borderRadius: 16, background: brand.accent2, padding: 24 }}><div style={{ height: "100%", borderRadius: 10, background: brand.surface, display: "grid", gridTemplateColumns: "180px 1fr", overflow: "hidden" }}><div style={{ background: "#f3efe9" }} /><div style={{ padding: 24 }}>{[80, 60, 70].map((w) => <div key={w} style={{ height: 14, width: `${w}%`, background: "#ece6de", borderRadius: 4, marginBottom: 14 }} />)}</div></div></div>
    </div>
  );
  if (view === 2) return <Canvas brand={brand}><div style={{ position: "absolute", left: 140, top: 300, width: 600 }}><div style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1 }}>Nine pages, one afternoon.</div><div style={{ fontSize: 20, color: brand.muted, marginTop: 20 }}>{asset.summary}</div></div><Phone brand={brand} style={{ right: 230, top: 95 }}><div style={{ transform: "scale(.34)", transformOrigin: "top left", width: 1000 }}>{page}</div></Phone></Canvas>;
  return (
    <Canvas brand={brand}>
      <Browser brand={brand} url={view === 0 ? "northwind.app" : "northwind.app/pricing"}>
        {view === 0 ? page : (
          <div style={{ padding: "50px 90px", fontFamily: "var(--display)" }}><div style={{ textAlign: "center", fontSize: 48, fontWeight: 700, letterSpacing: "-.03em" }}>Simple pricing</div><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 40 }}>{[["Starter", "₹0", "For trying it out"], ["Team", "₹2,400", "For growing teams"], ["Scale", "Custom", "For larger rollouts"]].map(([n, p, d], i) => <Card key={n} brand={brand} style={{ padding: 30, border: i === 1 ? `2px solid ${brand.accent}` : undefined }}><div style={{ fontSize: 18, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 44, fontWeight: 700, margin: "14px 0" }}>{p}</div><div style={{ color: brand.muted }}>{d}</div>{["Unlimited pages", "Custom domain", "Analytics"].map((x) => <div key={x} style={{ marginTop: 14, fontSize: 15 }}>— {x}</div>)}</Card>)}</div></div>
        )}
      </Browser>
    </Canvas>
  );
}

function Editor({ asset, entry, view }: Props) {
  const { brand } = entry;
  const posts = ["Why we moved docs to Git", "Release notes: 2.4", "Writing for skimmers", "Our editorial checklist", "Onboarding new writers", "The case for plain text"];
  return (
    <Canvas brand={brand}>
      <Browser brand={brand} url={`${asset.slug}.app/${view === 0 ? "edit/why-we-moved-docs-to-git" : view === 1 ? "content" : "publish"}`}>
        {view === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100%" }}>
            <div style={{ padding: "40px 46px", fontFamily: "var(--mono)", fontSize: 16, lineHeight: 1.9, borderRight: "1px solid #e8e4dc", color: "#3f3b35" }}>
              {["# Why we moved docs to Git", "", "Our writers wanted **review**, our", "engineers wanted **history**. Git", "gave us both, with one catch:", "", "> Writers should never see a merge.", "", "## What changed", "- Drafts live on branches", "- Review happens in the editor", "- Publishing is one click"].map((l, i) => <div key={i} style={{ color: l.startsWith("#") ? brand.accent2 : undefined }}>{l || " "}</div>)}
            </div>
            <div style={{ padding: "40px 56px", fontFamily: "var(--serif)" }}><div style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: "-.02em" }}>Why we moved docs to Git</div><p style={{ fontSize: 20, lineHeight: 1.6, color: "#3f3b35" }}>Our writers wanted <b>review</b>, our engineers wanted <b>history</b>. Git gave us both, with one catch:</p><blockquote style={{ margin: "24px 0", paddingLeft: 20, borderLeft: `3px solid ${brand.accent2}`, fontSize: 24, fontStyle: "italic" }}>Writers should never see a merge.</blockquote><div style={{ fontSize: 28 }}>What changed</div></div>
          </div>
        ) : (
          <div style={{ padding: "36px 60px", fontFamily: "var(--display)" }}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{view === 1 ? "Content" : "Publish log"}</div>
            <Card brand={brand} style={{ marginTop: 20, padding: 0 }}>{posts.map((p, i) => <div key={p} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 140px", padding: "17px 22px", borderBottom: "1px solid #eee", alignItems: "center", fontSize: 15 }}><b style={{ fontWeight: 600 }}>{p}</b><span style={{ color: brand.muted }}>{PEOPLE[i]}</span><span style={{ color: brand.muted }}>{view === 1 ? `${i + 2} Sep` : `main@${(0xa3f2c + i * 977).toString(16)}`}</span><Pill brand={brand} color={[brand.accent2, "#16a34a", "#6b7280"][i % 3]}>{view === 1 ? ["Draft", "Published", "In review"][i % 3] : ["Deployed", "Deployed", "Queued"][i % 3]}</Pill></div>)}</Card>
          </div>
        )}
      </Browser>
    </Canvas>
  );
}

function Editorial({ entry, view }: Props) {
  const { brand } = entry;
  const article = (grid: boolean) => (
    <div style={{ position: "relative", padding: "50px 120px", fontFamily: "var(--serif)" }}>
      {grid && <div style={{ position: "absolute", inset: "0 120px", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 20, pointerEvents: "none" }}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ background: "rgba(185,28,28,.08)" }} />)}</div>}
      <div style={{ position: "relative", fontSize: 13, fontFamily: "var(--display)", letterSpacing: ".12em", textTransform: "uppercase", color: brand.accent }}>Long read · Cities</div>
      <div style={{ position: "relative", fontSize: 84, lineHeight: 0.95, letterSpacing: "-.03em", marginTop: 20, maxWidth: 1000 }}>The quiet economics of the corner shop</div>
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 60, marginTop: 40 }}>
        <p style={{ fontSize: 22, lineHeight: 1.65, margin: 0 }}><span style={{ float: "left", fontSize: 92, lineHeight: 0.8, marginRight: 12, color: brand.accent }}>E</span>very neighbourhood has one: the shop that opens before the bakery and closes after the bar. Its margins are thin, its ledger is a notebook, and yet it outlasts the chains that open and close around it.</p>
        <div style={{ borderTop: `3px solid ${brand.ink}`, paddingTop: 16, fontSize: 30, lineHeight: 1.2, fontStyle: "italic" }}>“We are not selling milk. We are selling five minutes of certainty.”</div>
      </div>
    </div>
  );
  if (view === 2) return <Canvas brand={brand}><div style={{ position: "absolute", left: 140, top: 320, width: 560, fontFamily: "var(--serif)", fontSize: 60, lineHeight: 1, letterSpacing: "-.02em" }}>Built for the long read, on every screen.</div><Phone brand={brand} style={{ right: 230, top: 95 }}><div style={{ transform: "scale(.42)", transformOrigin: "top left", width: 760 }}>{article(false)}</div></Phone></Canvas>;
  return <Canvas brand={brand}><Browser brand={brand} url="thelongread.in/cities/corner-shop">{article(view === 1)}</Browser></Canvas>;
}

function Docs({ entry, view }: Props) {
  const { brand } = entry;
  const side = ["Introduction", "Quickstart", "Authentication", "Webhooks", "SDKs", "API reference", "Changelog"];
  return (
    <Canvas brand={brand}>
      <Browser brand={brand} url={view === 1 ? "docs.acme.dev/api/orders" : "docs.acme.dev/quickstart"}>
        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr 240px", height: "100%" }}>
          <div style={{ padding: 26, borderRight: "1px solid #eee" }}><div style={{ fontWeight: 700, fontSize: 18 }}>Acme Docs</div><div style={{ marginTop: 8, fontSize: 12, padding: "4px 8px", border: "1px solid #e5e5e5", borderRadius: 6, display: "inline-block" }}>v3.2 ▾</div>{side.map((s, i) => <div key={s} style={{ marginTop: 14, fontSize: 14, color: i === (view === 1 ? 5 : 1) ? brand.accent : brand.muted, fontWeight: i === (view === 1 ? 5 : 1) ? 600 : 400 }}>{s}</div>)}</div>
          <div style={{ padding: "36px 48px" }}>
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-.03em" }}>{view === 1 ? "List orders" : "Quickstart"}</div>
            <p style={{ fontSize: 17, color: brand.muted, lineHeight: 1.7 }}>{view === 1 ? "Returns a paginated list of orders, newest first." : "Install the SDK, set your key and make your first request in under five minutes."}</p>
            <div style={{ background: "#16161a", color: "#e6e6e6", borderRadius: 10, padding: 22, fontFamily: "var(--mono)", fontSize: 15, lineHeight: 1.8 }}><div style={{ color: "#8b8b93" }}># install</div><div>npm install <span style={{ color: brand.accent2 }}>@acme/sdk</span></div><div style={{ color: "#8b8b93", marginTop: 10 }}># first request</div><div>acme.orders.<span style={{ color: "#c4b5fd" }}>list</span>({"{"} limit: <span style={{ color: "#fbbf24" }}>20</span> {"}"})</div></div>
            <div style={{ marginTop: 22, padding: "14px 16px", borderRadius: 10, background: `${brand.accent}12`, fontSize: 15 }}><b>Tip.</b> Test keys never touch live data.</div>
          </div>
          <div style={{ padding: 26, fontSize: 13, color: brand.muted, lineHeight: 2.2 }}><b style={{ color: brand.ink }}>On this page</b>{["Install", "Authenticate", "First request", "Next steps"].map((h) => <div key={h}>{h}</div>)}</div>
        </div>
        {view === 2 && <div style={{ position: "absolute", inset: 0, background: "rgba(20,20,30,.35)", display: "grid", placeItems: "start center", paddingTop: 110 }}><div style={{ width: 640, background: "#fff", borderRadius: 14, overflow: "hidden" }}><div style={{ padding: "18px 22px", fontSize: 18, borderBottom: "1px solid #eee" }}>webhook ret|</div>{["Webhooks › Retries and backoff", "Webhooks › Verifying signatures", "Changelog › 3.1 retry headers", "SDKs › Handling webhook errors"].map((r, i) => <div key={r} style={{ padding: "15px 22px", fontSize: 15, background: i === 0 ? `${brand.accent}12` : "transparent" }}>{r}</div>)}</div></div>}
      </Browser>
    </Canvas>
  );
}

function Store({ asset, entry, view }: Props) {
  const { brand } = entry;
  const table = asset.slug === "tabletop";
  const Product = ({ tone, label }: { tone: string; label: string }) => <div style={{ aspectRatio: "3/4", background: tone, display: "grid", placeItems: "center" }}><svg width="46%" viewBox="0 0 100 110"><path d={table ? "M10 60 Q50 30 90 60 L84 70 Q50 48 16 70 Z M20 72 H80 L74 100 H26 Z" : "M30 10 L50 22 L70 10 L95 28 L82 48 L72 42 L72 105 L28 105 L28 42 L18 48 L5 28 Z"} fill={brand.surface} fillOpacity={0.9} /></svg><span style={{ display: "none" }}>{label}</span></div>;
  const tones = ["#c9b8a3", "#8f9a86", "#b98b6e", "#6e7b8b", "#d5c7b4", "#a58e7c"];
  if (view === 2) {
    return (
      <Canvas brand={brand}>
        <div style={{ position: "absolute", left: 140, top: 300, width: 580 }}><div style={{ fontFamily: fontOf(brand), fontSize: 62, lineHeight: 1, letterSpacing: "-.03em" }}>{entry.tagline}</div><div style={{ fontSize: 20, color: brand.muted, marginTop: 20 }}>{asset.summary}</div></div>
        <Phone brand={brand} style={{ right: 230, top: 95 }}><div style={{ padding: 20 }}><div style={{ fontSize: 24, fontWeight: 700 }}>{table ? "Book a table" : "Your bag"}</div>{table ? (<><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 18 }}>{["7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30"].map((t, i) => <span key={t} style={{ padding: "10px 0", textAlign: "center", borderRadius: 8, fontSize: 13, border: `1.5px solid ${i === 2 ? brand.accent : "#e4ddd3"}`, background: i === 2 ? brand.accent : "transparent", color: i === 2 ? "#fff" : brand.ink }}>{t}</span>)}</div><div style={{ marginTop: 20, fontSize: 14, color: brand.muted }}>4 guests · Friday</div></>) : [0, 1].map((i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 14, marginTop: 18 }}><Product tone={tones[i]} label="" /><div><b>{["Linen overshirt", "Everyday tee"][i]}</b><div style={{ color: brand.muted, fontSize: 13, marginTop: 4 }}>Size M</div><div style={{ marginTop: 8 }}>₹{["3,400", "1,200"][i]}</div></div></div>)}<div style={{ marginTop: 24, padding: 14, borderRadius: 10, background: brand.ink, color: "#fff", textAlign: "center", fontWeight: 600 }}>{table ? "Confirm booking" : "Checkout · ₹4,600"}</div></div></Phone>
      </Canvas>
    );
  }
  return (
    <Canvas brand={brand}>
      <Browser brand={brand} url={table ? `tabletop.menu/the-courtyard${view === 1 ? "/menu" : ""}` : `hearthwear.in/${view === 0 ? "linen-overshirt" : "collections/autumn"}`}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 50px", borderBottom: "1px solid #ebe5dc", fontSize: 14 }}><b style={{ fontFamily: fontOf(brand), fontSize: 22 }}>{table ? "The Courtyard" : "Hearth"}</b><span style={{ color: brand.muted }}>{table ? "Menu · Book · Visit" : "Shop · Journal · Stores"}</span><span>{table ? "Sign in" : "Bag (2)"}</span></div>
        {view === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 50, padding: "36px 50px" }}>
            {table ? (
              <Card brand={brand} style={{ padding: 28 }}><div style={{ fontSize: 22, fontWeight: 700 }}>October</div><div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 18 }}>{Array.from({ length: 28 }, (_, i) => <span key={i} style={{ padding: "12px 0", textAlign: "center", borderRadius: 8, background: i === 16 ? brand.accent : "transparent", color: i === 16 ? "#fff" : i % 7 === 0 ? brand.muted : brand.ink }}>{i + 1}</span>)}</div></Card>
            ) : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Product tone={tones[0]} label="" /><Product tone={tones[1]} label="" /></div>}
            <div><div style={{ fontSize: 14, color: brand.muted }}>{table ? "Dinner · 4 guests" : "Autumn · Linen"}</div><div style={{ fontFamily: fontOf(brand), fontSize: 50, lineHeight: 1, marginTop: 10 }}>{table ? "Friday, 17 October" : "Linen overshirt"}</div><div style={{ fontSize: 22, marginTop: 14 }}>{table ? "Choose a time" : "₹3,400"}</div><div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>{(table ? ["7:00", "7:30", "8:00", "8:30", "9:00"] : ["XS", "S", "M", "L", "XL"]).map((s, i) => <span key={s} style={{ padding: "12px 18px", border: `1.5px solid ${i === 2 ? brand.ink : "#ddd4c8"}`, borderRadius: 8, fontSize: 15 }}>{s}</span>)}</div><div style={{ marginTop: 28, padding: "16px 0", textAlign: "center", borderRadius: 10, background: brand.accent, color: "#fff", fontWeight: 600, fontSize: 17 }}>{table ? "Reserve and pre-order" : "Add to bag"}</div><p style={{ color: brand.muted, lineHeight: 1.6, marginTop: 20 }}>{table ? "A ₹500 deposit holds your table and is taken off the bill." : "Washed linen, relaxed fit, horn buttons. Made in Jaipur."}</p></div>
          </div>
        ) : (
          <div style={{ padding: "30px 50px" }}><div style={{ fontFamily: fontOf(brand), fontSize: 44 }}>{table ? "Pre-order from the menu" : "Autumn collection"}</div><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginTop: 24 }}>{tones.slice(0, 4).map((t, i) => <div key={t}><Product tone={t} label="" /><div style={{ marginTop: 10, fontWeight: 600 }}>{table ? ["Burrata, tomato", "Mushroom risotto", "Lamb shoulder", "Tiramisu"][i] : ["Linen overshirt", "Everyday tee", "Wool trousers", "Canvas tote"][i]}</div><div style={{ color: brand.muted }}>₹{table ? ["620", "780", "1,150", "420"][i] : ["3,400", "1,200", "4,100", "900"][i]}</div></div>)}</div></div>
        )}
      </Browser>
    </Canvas>
  );
}

function Extension({ dossier, entry, view }: Props) {
  const { brand } = entry;
  return (
    <Canvas brand={brand}>
      <Browser brand={brand} url={view === 2 ? "twitter.com" : "notion.so/quarterly-plan"}>
        {view === 2 ? (
          <div style={{ height: "100%", display: "grid", placeItems: "center", background: "#f6f4fb", textAlign: "center" }}><div><svg width={140} height={140}><circle cx={70} cy={70} r={60} fill="none" stroke={`${brand.accent}30`} strokeWidth={12} /><circle cx={70} cy={70} r={60} fill="none" stroke={brand.accent} strokeWidth={12} strokeDasharray={`${2 * Math.PI * 60 * 0.4} 999`} transform="rotate(-90 70 70)" strokeLinecap="round" /></svg><div style={{ fontSize: 44, fontWeight: 700, marginTop: 20 }}>Still focusing.</div><div style={{ fontSize: 20, color: brand.muted, marginTop: 10 }}>This site opens again in 14 minutes.</div></div></div>
        ) : (
          <div style={{ height: "100%", padding: "40px 80px", color: "#999" }}>{[70, 90, 60, 80, 50, 75, 65].map((w, i) => <div key={i} style={{ height: 14, width: `${w}%`, background: "#efefef", borderRadius: 4, marginBottom: 20 }} />)}</div>
        )}
        {view !== 2 && (
          <div style={{ position: "absolute", right: 30, top: 12, width: 380, background: "#fff", border: "1px solid #e4e4ea", borderRadius: 14, padding: 26 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><b>Studio Calm</b><span style={{ color: brand.muted }}>{view === 0 ? "Session 3 of 4" : "This week"}</span></div>
            {view === 0 ? (
              <div style={{ textAlign: "center", marginTop: 20 }}><svg width={220} height={220}><circle cx={110} cy={110} r={92} fill="none" stroke={`${brand.accent}25`} strokeWidth={14} /><circle cx={110} cy={110} r={92} fill="none" stroke={brand.accent} strokeWidth={14} strokeDasharray={`${2 * Math.PI * 92 * 0.62} 999`} transform="rotate(-90 110 110)" strokeLinecap="round" /><text x={110} y={122} textAnchor="middle" fontSize={44} fontWeight={700} fill="#1b1b1f">15:32</text></svg><div style={{ fontSize: 14, color: brand.muted }}>Blocking 6 sites</div><div style={{ marginTop: 18, padding: 13, borderRadius: 10, background: brand.accent, color: "#fff", fontWeight: 600 }}>Pause session</div></div>
            ) : (
              <div style={{ marginTop: 22 }}><div style={{ fontSize: 40, fontWeight: 700 }}>11h 20m</div><div style={{ fontSize: 13, color: brand.muted, marginBottom: 18 }}>focused, up 18% on last week</div><Bars values={dossier.series.values.slice(-7)} brand={brand} width={326} height={140} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: brand.muted, marginTop: 8 }}>{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div></div>
            )}
          </div>
        )}
      </Browser>
    </Canvas>
  );
}

const SCENES = { dashboard: Dashboard, portal: Portal, mobile: Mobile, identity: Identity, components: Components, code: Code, landing: Landing, editor: Editor, editorial: Editorial, docs: Docs, store: Store, extension: Extension };

export function Scene(props: Props) {
  const Component = SCENES[props.entry.kind];
  return <Component {...props} />;
}
