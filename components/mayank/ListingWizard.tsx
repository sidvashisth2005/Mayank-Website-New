"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import gsap from "gsap";
import { TransitionLink } from "./PageTransition";
import { Drawing } from "./visuals/Drawings";
import { RecordPlate, type PlateSource } from "./visuals/RecordPlate";
import { categories } from "@/lib/assets";
import { listingCategories, listingSchema, listingSteps, providerDependentCategories, transferReadiness, fieldErrors, type SubmitResult } from "@/lib/schemas";
import { prefersReducedMotion, scrollToElement } from "@/lib/scroll";

const DRAFT_KEY = "mayank-listing-draft";
const MAX_IMAGES = 4;
const MAX_TOTAL_CHARS = 3_600_000;

const steps = [
  { key: "asset", title: "Asset", heading: "Describe what exists." },
  { key: "deal", title: "Deal", heading: "Set the terms." },
  { key: "evidence", title: "Evidence", heading: "State what works today." },
  { key: "media", title: "Media", heading: "Show the work." },
  { key: "contact", title: "Contact", heading: "Keep the first review private." },
  { key: "review", title: "Review", heading: "Check before sending." },
] as const;

type Values = Record<string, string>;
type Image = { filename: string; type: string; content: string; preview: string };
type Draft = { values: Values; step: number; reached: number };
type Result = { ref: string; mode: "sent" | "demo"; method: string };

const emptyDraft: Draft = { values: { contactMethod: "Email", rentPeriod: "" }, step: 0, reached: 0 };

function readDraft(): Draft {
  try {
    const saved = JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? "null") as Draft | null;
    return saved?.values ? { ...emptyDraft, ...saved, values: { ...emptyDraft.values, ...saved.values } } : emptyDraft;
  } catch {
    return emptyDraft;
  }
}

function writeDraft(draft: Draft) {
  try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* storage unavailable: the form still works */ }
}

async function compress(file: File): Promise<Image> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const preview = canvas.toDataURL("image/jpeg", 0.8);
  return { filename: `${file.name.replace(/\.[^.]+$/, "").slice(0, 80)}.jpg`, type: "image/jpeg", content: preview.split(",")[1], preview };
}

function stepErrors(index: number, values: Values): Record<string, string> {
  const key = steps[index].key;
  if (key === "review") return {};
  const parsed = listingSteps[key].safeParse(values);
  const errors: Record<string, string> = parsed.success ? {} : fieldErrors(parsed.error);
  if (key === "deal" && values.dealType === "Rent or license" && !values.rentPeriod) errors.rentPeriod = "Choose a rental period.";
  if (key === "contact" && values.contactMethod === "WhatsApp" && (values.whatsapp ?? "").replace(/\D/g, "").length < 10) errors.whatsapp = "Enter a WhatsApp number with country code.";
  return errors;
}

const categoryInk: Record<string, string> = {
  "Complete product": "product", "Code or technical asset": "code", "Template or design system": "design", "Domain and identity": "domain",
  "Social media page": "provider", "Ad account": "provider", "Cloud credits or subscription": "provider", Other: "provider",
};

// The seller sees their record plate take shape as they fill the form.
function previewPlate(values: Values): PlateSource {
  const name = values.name?.trim() || "Your asset";
  const key = categoryInk[values.category ?? ""];
  const bars = Array.from({ length: 12 }, (_, index) => 25 + ((name.charCodeAt(index % name.length) * 37 + index * 53) % 70));
  const price = values.price ? `₹${Number(values.price).toLocaleString("en-IN")}` : undefined;
  return { id: "MX-NEW", name, ink: categories.find((category) => category.key === key)?.ink ?? "#5f625e", bars, label: values.category || "Category pending", price };
}

function Field({ name, label, optional, error, children }: { name: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <label className="wizard-field" htmlFor={name}>
      <span>{label}{optional && <i>optional</i>}</span>
      {children}
      {error && <em className="field-error" id={`${name}-error`}>{error}</em>}
    </label>
  );
}

function Wizard() {
  const [draft, setDraft] = useState<Draft>(readDraft);
  const [images, setImages] = useState<Image[]>([]);
  const [imageNote, setImageNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [eligible, setEligible] = useState(false);
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const startedAt = useRef(0);
  const stageRef = useRef<HTMLElement>(null);
  const { values, step, reached } = draft;
  const current = steps[step];

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return;
    const context = gsap.context(() => {
      gsap.timeline()
        .set(".wizard-leaf", { visibility: "visible" })
        .fromTo(".wizard-leaf", { yPercent: 100 }, { yPercent: -100, duration: 0.8, stagger: 0.08, ease: "power3.inOut" })
        .set(".wizard-leaf", { visibility: "hidden" })
        .fromTo(".wizard-panel > *", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.045, ease: "power3.out" }, 0.3);
    }, stage);
    return () => context.revert();
  }, [step, result]);

  function update(patch: Partial<Draft>) {
    const next = { ...draft, ...patch, values: { ...draft.values, ...patch.values } };
    setDraft(next);
    writeDraft(next);
  }

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    update({ values: { [name]: value } });
    if (errors[name]) setErrors((previous) => { const copy = { ...previous }; delete copy[name]; return copy; });
  }

  function goTo(index: number) {
    update({ step: index, reached: Math.max(reached, index) });
    setErrors({});
    setAlert("");
    const stage = stageRef.current;
    if (stage && stage.getBoundingClientRect().top < 0) scrollToElement(stage, -110);
  }

  function next() {
    const found = stepErrors(step, values);
    if (Object.keys(found).length) {
      setErrors(found);
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    goTo(step + 1);
  }

  async function addImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    event.target.value = "";
    const room = MAX_IMAGES - images.length;
    if (!files.length) return;
    setImageNote(files.length > room ? `Only ${MAX_IMAGES} images can be attached; the first ${room} were added.` : "");
    const compressed = await Promise.all(files.slice(0, room).map(compress));
    const combined = [...images, ...compressed];
    const total = combined.reduce((sum, image) => sum + image.content.length, 0);
    if (total > MAX_TOTAL_CHARS) {
      setImageNote("These images are too large together. Try fewer or smaller images.");
      return;
    }
    setImages(combined);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (current.key !== "review") {
      next();
      return;
    }
    const payload = { ...values, eligibility: eligible, images: images.map(({ filename, type, content }) => ({ filename, type, content })), website: values.website ?? "", startedAt: startedAt.current };
    const parsed = listingSchema.safeParse(payload);
    if (!parsed.success) {
      const found = fieldErrors(parsed.error);
      const firstStep = steps.findIndex((item, index) => item.key !== "review" && Object.keys(stepErrors(index, values)).length > 0);
      if (firstStep >= 0) {
        goTo(firstStep);
        setErrors(stepErrors(firstStep, values));
      } else setErrors(found);
      return;
    }
    setSending(true);
    setAlert("");
    try {
      const response = await fetch("/api/listings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const outcome = (await response.json()) as SubmitResult;
      if (outcome.ok) {
        setResult({ ref: outcome.ref, mode: outcome.mode, method: values.contactMethod });
        try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      } else setAlert(outcome.error);
    } catch {
      setAlert("The connection failed. Nothing was sent, and your draft is still saved on this device.");
    } finally {
      setSending(false);
    }
  }

  function restart() {
    setResult(null);
    setImages([]);
    setEligible(false);
    setDraft(emptyDraft);
  }

  const input = (name: string, props: Record<string, unknown> = {}) => ({
    id: name, name, value: values[name] ?? "", onChange,
    "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${name}-error` : undefined, ...props,
  });

  if (result) {
    return (
      <div className="wizard is-done" ref={stageRef as React.RefObject<HTMLDivElement>}>
        <div className="wizard-stage">
          <i className="wizard-leaf" /><i className="wizard-leaf" />
          <div className="wizard-panel wizard-receipt" role="status">
            <span className="label">Listing received / Private review</span>
            <strong className="receipt-ref">{result.ref}</strong>
            {result.mode === "sent"
              ? <p>Your asset has reached the Mayank review desk. It has not been published. Keep this reference for any follow-up.</p>
              : <p><b>Demo mode.</b> This deployment has no inbox configured yet, so the listing was checked but not sent anywhere. Nothing was published.</p>}
            <ol className="receipt-steps">
              <li><span>01</span><strong>Private review</strong><p>Identity, ownership, condition and the transfer route are checked.</p></li>
              <li><span>02</span><strong>Questions, if any</strong><p>The review desk replies by {result.method === "WhatsApp" ? "WhatsApp" : "email"} with anything it needs.</p></li>
              <li><span>03</span><strong>Publication</strong><p>Nothing is published until the review is complete.</p></li>
            </ol>
            <div className="wizard-actions">
              <button type="button" className="btn btn-outline" onClick={restart}>List another asset</button>
              <TransitionLink href="/market" className="text-link">Browse the market</TransitionLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const providerDependent = providerDependentCategories.includes(values.category ?? "");
  const summary: [number, string, string][] = [
    [0, "Asset", values.name], [0, "Category", values.category], [0, "Description", values.description],
    [1, "Deal", values.dealType === "Rent or license" ? `Rent or licence, per ${values.rentPeriod || "period not set"}` : values.dealType],
    [1, "Asking price", values.price ? `₹${Number(values.price).toLocaleString("en-IN")}` : ""], [1, "Asset age", values.age],
    [2, "Present condition", values.condition], [2, "Metrics", values.metrics], [2, "Transfer readiness", values.transfer], [2, "Dependencies", values.dependencies],
    [3, "Images", images.length ? `${images.length} attached` : "None"], [3, "Video link", values.videoUrl],
    [4, "Seller", values.seller], [4, "Contact", values.contactMethod === "WhatsApp" ? `WhatsApp, ${values.whatsapp}` : "Email"], [4, "Email", values.email], [4, "LinkedIn", values.linkedin],
  ];

  return (
    <form className="wizard" ref={stageRef as React.RefObject<HTMLFormElement>} noValidate onSubmit={submit} onFocus={() => { if (!startedAt.current) startedAt.current = Date.now(); }}>
      <aside className="wizard-side">
      <ol className="wizard-rail" aria-label="Listing steps">
        {steps.map((item, index) => (
          <li key={item.key} className={index === step ? "is-current" : index < reached ? "is-done" : ""}>
            <button type="button" disabled={index > reached} aria-current={index === step ? "step" : undefined} onClick={() => goTo(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.title}<small>{index === step ? "Now" : index < reached ? "Saved" : ""}</small>
            </button>
          </li>
        ))}
      </ol>
      <figure className="wizard-preview">
        <RecordPlate source={previewPlate(values)} variant="stamp" title={`Preview of the record plate for ${values.name || "your asset"}`} />
        <figcaption>Your record, as it will be filed{values.price ? ` / ₹${Number(values.price).toLocaleString("en-IN")}` : ""}</figcaption>
      </figure>
      </aside>

      <div className="wizard-stage">
        <i className="wizard-leaf" /><i className="wizard-leaf" />
        <div className="wizard-panel" key={step}>
          <header className="wizard-head"><div><span className="label">{String(step + 1).padStart(2, "0")} / {current.title}</span><h2>{current.heading}</h2></div><Drawing name={current.key} className="wizard-drawing" /></header>

          {current.key === "asset" && <>
            <Field name="name" label="Asset name" error={errors.name}><input {...input("name", { placeholder: "What did you build?", autoComplete: "off" })} /></Field>
            <Field name="category" label="Category" error={errors.category}>
              <select {...input("category")}><option value="" disabled>Select the closest fit</option>{listingCategories.map((category) => <option key={category}>{category}</option>)}</select>
            </Field>
            {providerDependent && <p className="wizard-notice">This category depends on the provider&apos;s rules. It can be listed only when the provider permits a documented transfer. See the <TransitionLink href="/restricted-assets">restricted assets standard</TransitionLink>.</p>}
            <Field name="description" label="What it is, its current status and why it has value" error={errors.description}><textarea {...input("description", { placeholder: "A focused analytics workspace for subscription teams. Live for 18 months, 1,200 active accounts…" })} /></Field>
          </>}

          {current.key === "deal" && <>
            <fieldset className="choice-set" aria-describedby={errors.dealType ? "dealType-error" : undefined}>
              <legend>Deal type</legend>
              {[["Sell", "Transfer ownership outright."], ["Rent or license", "Keep ownership; license it for a period."]].map(([deal, copy]) => (
                <label key={deal} className={values.dealType === deal ? "is-selected" : ""}>
                  <input type="radio" name="dealType" id={deal === "Sell" ? "dealType" : undefined} value={deal} checked={values.dealType === deal} onChange={onChange} />
                  <strong>{deal === "Sell" ? "Sell" : "Rent or licence"}</strong><small>{copy}</small>
                </label>
              ))}
              {errors.dealType && <em className="field-error" id="dealType-error">{errors.dealType}</em>}
            </fieldset>
            <div className="form-pair">
              <Field name="price" label={values.dealType === "Rent or license" ? "Price per period in INR" : "Asking price in INR"} error={errors.price}><input {...input("price", { type: "number", min: 0, inputMode: "numeric", placeholder: "185000" })} /></Field>
              {values.dealType === "Rent or license"
                ? <Field name="rentPeriod" label="Rental period" error={errors.rentPeriod}><select {...input("rentPeriod")}><option value="" disabled>Per month or year</option><option value="month">Per month</option><option value="year">Per year</option></select></Field>
                : <Field name="age" label="Asset age" error={errors.age}><input {...input("age", { placeholder: "e.g. 18 months" })} /></Field>}
            </div>
            {values.dealType === "Rent or license" && <Field name="age" label="Asset age" error={errors.age}><input {...input("age", { placeholder: "e.g. 18 months" })} /></Field>}
          </>}

          {current.key === "evidence" && <>
            <Field name="condition" label="Present condition" error={errors.condition}><textarea {...input("condition", { placeholder: "What works today, and what needs attention?" })} /></Field>
            <Field name="metrics" label="Available metrics" optional error={errors.metrics}><textarea {...input("metrics", { placeholder: "Traffic, active users, followers, engagement, remaining credits or another useful measure" })} /></Field>
            <Field name="transfer" label="Transfer readiness" error={errors.transfer}>
              <select {...input("transfer")}><option value="" disabled>Choose the most accurate statement</option>{transferReadiness.map((item) => <option key={item}>{item}</option>)}</select>
            </Field>
            <Field name="dependencies" label="Provider or third-party dependencies" optional error={errors.dependencies}><input {...input("dependencies", { placeholder: "Hosting, app store, registrar, licences…" })} /></Field>
          </>}

          {current.key === "media" && <>
            <div className="media-drop">
              <label htmlFor="images"><strong>Add up to four images</strong><span>Screenshots, interface captures or identity files. Images are compressed on this device before sending.</span></label>
              <input id="images" type="file" accept="image/*" multiple onChange={addImages} disabled={images.length >= MAX_IMAGES} />
            </div>
            {imageNote && <p className="wizard-notice" role="status">{imageNote}</p>}
            {images.length > 0 && (
              <ul className="media-list">
                {images.map((image, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <li key={image.preview.slice(-24) + index}><img src={image.preview} alt={`Attachment ${index + 1}`} /><span>{image.filename}</span><button type="button" onClick={() => setImages(images.filter((_, other) => other !== index))}>Remove</button></li>
                ))}
              </ul>
            )}
            <Field name="videoUrl" label="Short video link" optional error={errors.videoUrl}><input {...input("videoUrl", { type: "url", placeholder: "https://" })} /></Field>
            <p className="wizard-fine">Images are not kept in the saved draft. Re-add them if you return later.</p>
          </>}

          {current.key === "contact" && <>
            <div className="form-pair">
              <Field name="seller" label="Seller name" error={errors.seller}><input {...input("seller", { placeholder: "First name is enough", autoComplete: "given-name" })} /></Field>
              <Field name="contactMethod" label="Contact preference" error={errors.contactMethod}><select {...input("contactMethod")}><option>Email</option><option>WhatsApp</option></select></Field>
            </div>
            <Field name="email" label="Professional email" error={errors.email}><input {...input("email", { type: "email", placeholder: "name@company.com", autoComplete: "email" })} /></Field>
            {values.contactMethod === "WhatsApp" && <Field name="whatsapp" label="WhatsApp number" error={errors.whatsapp}><input {...input("whatsapp", { type: "tel", placeholder: "+91 98xxxxxx10", autoComplete: "tel" })} /></Field>}
            <Field name="linkedin" label="LinkedIn profile" optional error={errors.linkedin}><input {...input("linkedin", { type: "url", placeholder: "https://linkedin.com/in/…" })} /></Field>
            <p className="wizard-fine">Contact details are used for the review only and never appear on a public record.</p>
          </>}

          {current.key === "review" && <>
            <dl className="review-sheet">
              {summary.map(([target, label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd><button type="button" onClick={() => goTo(target)} aria-label={`Edit ${label}`}>Edit</button></div>
              ))}
            </dl>
            <label className="eligibility-confirm">
              <input type="checkbox" checked={eligible} onChange={(event) => { setEligible(event.target.checked); setErrors({}); }} aria-invalid={!!errors.eligibility} />
              <span>I confirm that I have the right to offer this asset and understand that provider-dependent assets require separate eligibility review.</span>
            </label>
            {errors.eligibility && <em className="field-error">{errors.eligibility}</em>}
          </>}

          <label className="honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" value={values.website ?? ""} onChange={onChange} /></label>
          {alert && <p className="form-alert" role="alert">{alert}</p>}

          <div className="wizard-actions">
            {step > 0 && <button type="button" className="btn btn-outline" onClick={() => goTo(step - 1)}>Back</button>}
            <button type="submit" className="btn btn-solid" disabled={sending}>
              {current.key === "review" ? (sending ? "Sending for review" : "Send for private review") : `Continue to ${steps[step + 1].title.toLowerCase()}`}
              <span>{current.key === "review" ? "Nothing publishes automatically" : "Draft saved on this device"}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

const noop = () => () => {};

// The draft lives in localStorage, so the wizard renders only after hydration.
export function ListingWizard() {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  if (!hydrated) return <div className="wizard wizard-pending" />;
  return <Wizard />;
}
