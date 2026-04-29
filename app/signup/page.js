import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/chat");
  }

  return (
    <section className="page-section">
      <div className="container auth-shell">
        <div className="panel auth-copy">
          <span className="eyebrow">Free beta access</span>
          <h1>Create an account for your Astro AI workspace.</h1>
          <p>
            This is the cleanest version of the product so far: users can sign
            up, keep their reading history, and return later without losing
            conversations.
          </p>

          <ul>
            <li>Free plan is active immediately</li>
            <li>Each account gets saved chats and private history</li>
            <li>Built to move into premium later</li>
          </ul>

          <div className="auth-note">
            <p className="helper-copy">
              You can later add billing, usage limits, or stronger AI features
              on top of this structure.
            </p>
          </div>

          <div className="auth-links">
            <span>Already have an account?</span>
            <Link href="/login">Log in here</Link>
          </div>
        </div>

        <AuthForm mode="signup" />
      </div>
    </section>
  );
}
