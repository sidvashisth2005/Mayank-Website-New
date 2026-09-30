import { requireViewer } from "@/lib/server/session";
import { ActionForm } from "@/components/mayank/account/ActionForm";
import { AccountSecurity } from "@/components/mayank/account/AccountSecurity";
import { saveProfile, submitTestimonial } from "../actions";

export const metadata = { title: "Settings" };

export default async function DeskSettings() {
  const viewer = await requireViewer("/dashboard/settings");
  const { profile } = viewer;
  return (
    <>
      <header className="desk-head">
        <span className="label">05 / Settings</span>
        <h1>How Mayank <em>knows you.</em></h1>
      </header>

      <section aria-labelledby="profile-title" className="desk-settings">
        <h2 className="desk-subhead" id="profile-title">Profile</h2>
        <ActionForm action={saveProfile} className="ledger-form desk-profile">
          <label><span>Display name</span><input name="displayName" defaultValue={profile.displayName} maxLength={60} required autoComplete="name" /></label>
          <label><span>You are here to<i>Shapes what your desk shows first</i></span>
            <select name="role" defaultValue={profile.role}>
              <option value="both">Buy and sell</option>
              <option value="buyer">Buy</option>
              <option value="seller">Sell</option>
            </select>
          </label>
          <label><span>City<i>Optional</i></span><input name="city" defaultValue={profile.city} maxLength={60} autoComplete="address-level2" placeholder="Bengaluru" /></label>
          <fieldset className="desk-toggles">
            <legend className="label">Email me when</legend>
            <label><input type="checkbox" name="notifyEnquiries" defaultChecked={profile.notifyEnquiries} /><span>A buyer enquires about one of my listings</span></label>
            <label><input type="checkbox" name="notifyReview" defaultChecked={profile.notifyReview} /><span>The review desk moves one of my listings</span></label>
          </fieldset>
          <p className="desk-fine">Signed in as {viewer.email || "an unverified address"}. Your email is never shown on a public record.</p>
          <button type="submit" className="btn btn-solid">Save profile<span>Changes apply at once</span></button>
        </ActionForm>
      </section>

      <section aria-labelledby="voice-title" className="desk-settings">
        <h2 className="desk-subhead" id="voice-title">Say how it went</h2>
        <p className="desk-fine">Listed or bought through Mayank? A short, specific testimonial helps the next founder decide. It is shown with your first name and initial, and only after moderation.</p>
        <ActionForm action={submitTestimonial} className="ledger-form desk-profile">
          <label><span>Your role</span><input name="authorRole" maxLength={80} required placeholder="Founder, subscription analytics" /></label>
          <label><span>Testimonial<i>40 to 600 characters</i></span><textarea name="quote" rows={4} minLength={40} maxLength={600} required placeholder="What happened, what the review desk asked for, how the handover went." /></label>
          <button type="submit" className="btn btn-solid">Send for moderation<span>Nothing publishes automatically</span></button>
        </ActionForm>
      </section>

      <section aria-labelledby="security-title" className="desk-settings">
        <h2 className="desk-subhead" id="security-title">Sign-in and security</h2>
        <p className="desk-fine">Password, two-step verification, connected accounts and active sessions.</p>
        <AccountSecurity />
      </section>
    </>
  );
}
