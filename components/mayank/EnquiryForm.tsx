"use client";

import { useRef, useState, type FormEvent } from "react";
import { enquiryIntents, enquirySchema, fieldErrors, type SubmitResult } from "@/lib/schemas";
import { useUser } from "@clerk/nextjs";
import { TransitionLink } from "./PageTransition";

// key is a catalogue slug, or "member:<listing id>" for a member listing.
export type EnquiryTarget = { key: string; id: string; closed: boolean; deal: "sell" | "rent" };

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; ref: string; mode: "sent" | "demo"; email: string } | { kind: "error"; message: string };

export function EnquiryForm({ target }: { target: EnquiryTarget }) {
  const startedAt = useRef(0);
  const { isSignedIn, user } = useUser();
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const closed = target.closed;
  const defaultIntent = closed ? "Ask about similar assets" : target.deal === "rent" ? "Rent or licence" : "Buy outright";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const payload = { ...data, asset: target.key, startedAt: startedAt.current };
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
        <span>Enquiry registered / {target.id}</span>
        <strong>{state.ref}</strong>
        {state.mode === "sent"
          ? <p>Your enquiry has reached the Mayank review desk. Replies will come to <b>{state.email}</b>. Keep the reference above for any follow-up.</p>
          : <p>Your enquiry is filed. This deployment has no desk inbox configured, so no email copy was sent.</p>}
        {isSignedIn && <p>The conversation is filed in <TransitionLink className="text-link" href="/dashboard/enquiries?box=sent">your desk</TransitionLink>.</p>}
        <button type="button" className="text-link" onClick={() => setState({ kind: "idle" })}>Write another enquiry</button>
      </div>
    );
  }

  const error = (name: string) => errors[name] && <em className="field-error" id={`${name}-error`}>{errors[name]}</em>;
  const described = (name: string) => (errors[name] ? `${name}-error` : undefined);

  return (
    <form className="ledger-form" noValidate onSubmit={submit} onFocus={() => { if (!startedAt.current) startedAt.current = Date.now(); }}>
      <div className="form-pair">
        <label><span>Your name</span><input name="name" autoComplete="name" defaultValue={user?.fullName ?? ""} key={user?.id ?? "guest"} aria-invalid={!!errors.name} aria-describedby={described("name")} />{error("name")}</label>
        <label><span>Professional email</span><input name="email" type="email" autoComplete="email" defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""} key={user?.id ?? "guest"} placeholder="name@company.com" aria-invalid={!!errors.email} aria-describedby={described("email")} />{error("email")}</label>
      </div>
      <div className="form-pair">
        <label><span>Company <i>optional</i></span><input name="company" autoComplete="organization" /></label>
        <label><span>Intent</span><select name="intent" defaultValue={defaultIntent}>{enquiryIntents.map((intent) => <option key={intent}>{intent}</option>)}</select></label>
      </div>
      <label><span>Budget in INR <i>optional</i></span><input name="budget" inputMode="numeric" placeholder="e.g. 1,50,000" /></label>
      <label><span>Message to the seller</span><textarea name="message" placeholder="What you plan to do with the asset, and what you need to see first." aria-invalid={!!errors.message} aria-describedby={described("message")} />{error("message")}</label>
      <label className="honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
      {isSignedIn === false && <p className="form-hint"><TransitionLink className="text-link" href="/sign-in">Sign in</TransitionLink> to keep this conversation in your desk. Not required.</p>}
      {state.kind === "error" && <p className="form-alert" role="alert">{state.message}</p>}
      <button className="btn btn-solid btn-wide" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Sending enquiry" : "Send private enquiry"}<span>{closed ? "Record closed / similar assets" : "Seller details stay private"}</span>
      </button>
    </form>
  );
}
