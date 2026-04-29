import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/chat");
  }

  return (
    <section className="page-section">
      <div className="container auth-shell">
        <div className="panel auth-copy">
          <span className="eyebrow">Welcome back</span>
          <h1>Log in and continue your saved readings.</h1>
          <p>
            Your account unlocks private chat history, a cleaner free-beta
            workspace, and a simple upgrade path for premium later.
          </p>

          <ul>
            <li>Private sessions per user</li>
            <li>Saved chat history in one sidebar</li>
            <li>Free plan active by default</li>
          </ul>

          <div className="auth-note">
            <p className="helper-copy">
              No premium payment flow is enabled yet. Everyone starts on the
              free beta for now.
            </p>
          </div>

          <div className="auth-links">
            <span>Need an account?</span>
            <Link href="/signup">Create one here</Link>
          </div>
        </div>

        <AuthForm mode="login" />
      </div>
    </section>
  );
}
