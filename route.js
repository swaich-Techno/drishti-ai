import Link from "next/link";

export default function Home() {
  return (
    <section className="container hero">
      <div className="hero-grid">
        <div className="hero-copy panel">
          <span className="eyebrow">Now free to use</span>
          <h1>Astrology, tarot and numerology in one calm experience.</h1>
          <p>
            Drishti AI is now a free Next.js app with a working reading flow,
            cleaner structure and a simple Vercel deployment.
          </p>

          <div className="hero-actions">
            <Link href="/reading" className="button-link">
              Start free reading
            </Link>
            <Link href="/dashboard" className="secondary-button">
              View app guide
            </Link>
          </div>
        </div>

        <aside className="panel plan-card">
          <span className="eyebrow">Free access</span>
          <div className="plan-price">
            <strong>Rs. 0</strong>
            <span>/ now</span>
          </div>
          <ul className="plan-list">
            <li>Astrology readings</li>
            <li>Numerology answers</li>
            <li>Tarot card guidance</li>
            <li>Vedic and palmistry prompts</li>
            <li>Kundli compatibility check</li>
          </ul>
          <p className="tiny-note">
            No payment integration or environment variables are needed for the
            current version.
          </p>
        </aside>
      </div>

      <div className="feature-grid">
        <article className="panel feature-card">
          <h3>Fixed app structure</h3>
          <p className="muted-copy">
            The missing root layout and reading API route are already in place,
            so the app builds correctly.
          </p>
        </article>

        <article className="panel feature-card">
          <h3>Simple free flow</h3>
          <p className="muted-copy">
            Users can open the reading room and generate results immediately,
            without any payment or login step.
          </p>
        </article>

        <article className="panel feature-card">
          <h3>Beginner-friendly setup</h3>
          <p className="muted-copy">
            Upload the repo to GitHub, import it into Vercel and deploy.
          </p>
        </article>
      </div>
    </section>
  );
}
