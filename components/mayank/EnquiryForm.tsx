"use client";

import { useRef, useState, type FormEvent } from "react";
import { enquiryIntents, enquirySchema, fieldErrors, type SubmitResult } from "@/lib/schemas";
import type { Asset } from "@/lib/assets";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; ref: string; mode: "sent" | "demo"; email: string } | { kind: "error"; message: string };

export function EnquiryForm({ asset }: { asset: Asset }) {
  const startedAt = useRef(0);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const closed = asset.status !== "live";
  const defaultIntent = closed ? "Ask about similar assets" : asset.deal === "rent" ? "Rent or licence" : "Buy outright";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const payload = { ...data, asset: asset.slug, startedAt: startedAt.current };
    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const result = (await response.json()) as SubmitResult;
      if (result.ok) setState({ kind: "done", ref: result.ref, mode: result.mode, email: parsed.data.email });
      else {
        setErrors(result.fields ?? {});
        setState({ kind: "error", message: result.error });
      }
    } catch {
      setState({ kind: "error", message: "The connection failed. Nothing was sent. Please try again." });
    }
  }

  if (state.kind === "done") {
    return (
      <div className="form-receipt" role="status">
        <span>Enquiry registered / {asset.id}</span>
        <strong>{state.ref}</strong>
        {state.mode === "sent"
          ? <p>Your enquiry has reached the Mayank review desk. Replies will come to <b>{state.email}</b>. Keep the reference above for any follow-up.</p>
          : <p><b>Demo mode.</b> This deployment has no inbox configured yet, so the enquiry was checked but not sent anywhere.</p>}
        <button type="button" className="text-link" onClick={() => setState({ kind: "idle" })}>Write another enquiry</button>
      </div>
    );
  }

  const error = (name: string) => errors[name] && <em className="field-error" id={`${name}-error`}>{errors[name]}</em>;
  const described = (name: string) => (errors[name] ? `${name}-error` : undefined);

  return (
    <form className="ledger-form" noValidate onSubmit={submit} onFocus={() => { if (!startedAt.current) startedAt.current = Date.now(); }}>
      <div className="form-pair">
        <label><span>Your name</span><input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={described("name")} />{error("name")}</label>
        <label><span>Professional email</span><input name="email" type="email" autoComplete="email" placeholder="name@company.com" aria-invalid={!!errors.email} aria-describedby={described("email")} />{error("email")}</label>
      </div>
      <div className="form-pair">
        <label><span>Company <i>optional</i></span><input name="company" autoComplete="organization" /></label>
        <label><span>Intent</span><select name="intent" defaultValue={defaultIntent}>{enquiryIntents.map((intent) => <option key={intent}>{intent}</option>)}</select></label>
      </div>
      <label><span>Budget in INR <i>optional</i></span><input name="budget" inputMode="numeric" placeholder="e.g. 1,50,000" /></label>
      <label><span>Message to the seller</span><textarea name="message" placeholder="What you plan to do with the asset, and what you need to see first." aria-invalid={!!errors.message} aria-describedby={described("message")} />{error("message")}</label>
      <label className="honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
      {state.kind === "error" && <p className="form-alert" role="alert">{state.message}</p>}
      <button className="btn btn-solid btn-wide" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Sending enquiry" : "Send private enquiry"}<span>{closed ? "Record closed / similar assets" : "Seller details stay private"}</span>
      </button>
    </form>
  );
}
