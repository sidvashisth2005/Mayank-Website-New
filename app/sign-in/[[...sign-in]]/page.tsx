import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthStage } from "@/components/mayank/account/AuthStage";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function SignInPage() {
  return (
    <AuthStage label="Account / Sign in" title={<>Back to <em>your desk.</em></>}>
      <SignIn />
    </AuthStage>
  );
}
