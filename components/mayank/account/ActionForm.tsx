"use client";

import { useActionState, type ReactNode } from "react";

export type ActionState = { ok: boolean; message: string } | null;

// A form bound to a server action. Controls are disabled while it runs and the
// outcome is announced in place, next to what was changed.
export function ActionForm({ action, children, className }: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={className} aria-busy={pending}>
      <fieldset className="action-fieldset" disabled={pending}>{children}</fieldset>
      <p className={`action-note${state && !state.ok ? " is-error" : ""}`} role="status" aria-live="polite">
        {pending ? "Saving" : state?.message ?? ""}
      </p>
    </form>
  );
}
