import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthStage } from "@/components/mayank/account/AuthStage";

export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };

export default function SignUpPage() {
  return (
    <AuthStage label="Account / New member" title={<>Open a desk <em>at Mayank.</em></>}>
      <SignUp />
    </AuthStage>
  );
}
