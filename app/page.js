import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

const features = [
  {
    title: "Login that feels product-ready",
    body: "People can create an account, return later, and keep their personal reading space instead of starting over every visit.",
  },
  {
    title: "Saved conversation history",
    body: "Each user gets a private sidebar of previous chats so questions, readings, and follow-ups stay organized.",
  },
  {
    title: "Free now, premium later",
    body: "The app already tracks plan status as free beta, so you can add paid upgrades later without rebuilding the whole structure.",
  },
];

const roadmap = [
  "Astrology-style answers with optional birth details",
  "MongoDB-ready persistence for users, sessions, and chats",
  "A cleaner foundation for future premium plans and AI upgrades",
];

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      <section className="page-section">
        <div className="container hero">
          <div className="hero-grid">
            <div className="panel hero-copy">
              <span className="eyebrow">Redesigned for launch</span>
              <h1>Astro AI that remembers every question.</h1>
              <p>
                Drishti AI is now a calmer, more complete free-beta product:
                sign up, log in, ask astrology-style questions, and keep a real
                chat history for each user.
              </p>

              <div className="hero-actions">
                <Link href={user ? "/chat" : "/signup"} className="button-link">
                  {user ? "Open your workspace" : "Create free account"}
                </Link>
                <Link href={user ? "/chat" : "/login"} className="secondary-button">
                  {user ? "Go to saved chats" : "Log in"}
                </Link>
              </div>

              <p className="tiny-note">
                Free now. The premium path is ready to add later through plan
                checks, better AI, and paid features.
              </p>
            </div>

            <aside className="panel hero-card">
              <span className="eyebrow">What changed</span>
              <h2>Built like a real product, not just a demo page.</h2>

              <div className="metric-grid">
                <div className="metric-card">
                  <p className="detail-label">Plan</p>
                  <strong className="metric-value">Free</strong>
                  <p className="helper-copy">Beta access for everyone right now.</p>
                </div>

                <div className="metric-card">
                  <p className="detail-label">History</p>
                  <strong className="metric-value">Saved</strong>
                  <p className="helper-copy">Each user gets their own chat archive.</p>
                </div>
              </div>

              <ul>
                {roadmap.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="panel feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p className="muted-copy">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">How it works</span>
            <h1>Simple flow for users now, strong foundation for you later.</h1>
            <p>
              The user journey is now clear: create an account, ask a question,
              and come back any time to continue the same spiritual or
              astrology-inspired conversation.
            </p>
          </div>

          <div className="trust-grid">
            <article className="panel roadmap-card">
              <h3>User flow</h3>
              <p className="muted-copy">
                Signup and login routes are built in. After login, users land in
                a private workspace where every conversation is tied to their
                account and shown in history.
              </p>
            </article>

            <article className="panel roadmap-card">
              <h3>Premium later</h3>
              <p className="muted-copy">
                The app already stores users with a free plan flag. That means
                you can later add paid checks, usage limits, report downloads,
                or better AI responses without starting over.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="panel notice-box">
            <strong>Product honesty note</strong>
            <p className="truth-note">
              This version gives guidance-style responses and symbolic
              astrology-inspired readings. It is not an exact Vedic
              calculation engine yet, which keeps the product free and easy to
              deploy while you build toward premium features.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
