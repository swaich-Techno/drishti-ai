:root {
  --bg: #06111a;
  --bg-soft: rgba(12, 29, 41, 0.82);
  --card: rgba(10, 25, 38, 0.86);
  --card-strong: rgba(15, 35, 50, 0.94);
  --border: rgba(255, 255, 255, 0.1);
  --text: #f4efe6;
  --muted: #b8c3cf;
  --accent: #de6a3d;
  --accent-soft: #f4ab6e;
  --success: #78d6a3;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  font-family: var(--font-sans), sans-serif;
  background:
    radial-gradient(circle at top, rgba(222, 106, 61, 0.26), transparent 28%),
    radial-gradient(circle at 18% 18%, rgba(61, 171, 166, 0.16), transparent 34%),
    linear-gradient(180deg, #04101a 0%, #081524 46%, #050d16 100%);
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px);
  background-size: 42px 42px;
  opacity: 0.14;
  pointer-events: none;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

h1,
h2,
h3 {
  margin: 0;
  font-family: var(--font-display), serif;
  letter-spacing: -0.03em;
  line-height: 0.98;
}

p {
  margin: 0;
  line-height: 1.7;
}

.site-shell {
  position: relative;
  z-index: 1;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(18px);
  background: rgba(4, 12, 20, 0.76);
  border-bottom: 1px solid var(--border);
}

.container {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.nav-row,
.footer-row,
.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.nav-row {
  min-height: 72px;
}

.brand {
  font-family: var(--font-display), serif;
  font-size: 1.7rem;
}

.site-nav {
  display: flex;
  gap: 20px;
  color: var(--muted);
}

.site-nav a:hover,
.button-link:hover,
.ghost-link:hover {
  color: var(--text);
}

.site-footer {
  padding: 32px 0 48px;
  color: var(--muted);
}

.page-section {
  padding: 72px 0;
}

.hero {
  display: grid;
  gap: 28px;
  padding: 88px 0 64px;
}

.hero-grid,
.reading-layout,
.dashboard-grid,
.detail-grid,
.form-grid,
.feature-grid {
  display: grid;
  gap: 20px;
}

.hero-grid {
  grid-template-columns: 1.3fr 0.9fr;
  align-items: stretch;
}

.hero-copy h1 {
  font-size: clamp(3rem, 8vw, 5.7rem);
  max-width: 10ch;
}

.hero-copy p,
.section-header p,
.muted-copy {
  color: var(--muted);
}

.eyebrow,
.status-pill,
.detail-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-soft);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.button-link,
.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.button-link,
.primary-button {
  background: linear-gradient(135deg, var(--accent), var(--accent-soft));
  color: #130b08;
  font-weight: 800;
}

.secondary-button {
  background: transparent;
  color: var(--text);
  border-color: var(--border);
}

.button-link:hover,
.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-1px);
}

.panel {
  padding: 28px;
  background: linear-gradient(180deg, rgba(16, 37, 54, 0.92), rgba(8, 21, 33, 0.94));
  border: 1px solid var(--border);
  border-radius: 28px;
  box-shadow: var(--shadow);
}

.plan-card {
  display: grid;
  gap: 18px;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.plan-price strong,
.metric-value {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1;
}

.plan-list {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
  color: var(--muted);
}

.plan-list li::before {
  content: "+";
  color: var(--accent-soft);
  margin-right: 10px;
}

.feature-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.feature-card {
  display: grid;
  gap: 12px;
}

.feature-card h3,
.panel h2 {
  font-size: 1.7rem;
}

.section-header {
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
  max-width: 720px;
}

.section-header h1 {
  font-size: clamp(2.6rem, 6vw, 4.2rem);
}

.reading-layout {
  grid-template-columns: 1.15fr 0.85fr;
  align-items: start;
}

.form-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-grid .full {
  grid-column: 1 / -1;
}

label {
  display: grid;
  gap: 10px;
  color: var(--muted);
  font-size: 0.95rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(4, 12, 20, 0.66);
  color: var(--text);
  outline: none;
}

input:focus,
textarea:focus,
select:focus {
  border-color: rgba(244, 171, 110, 0.8);
  box-shadow: 0 0 0 4px rgba(222, 106, 61, 0.12);
}

textarea {
  min-height: 140px;
  resize: vertical;
}

.stack {
  display: grid;
  gap: 18px;
}

.subscription-card {
  display: grid;
  gap: 18px;
}

.status-pill {
  width: fit-content;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(120, 214, 163, 0.12);
  border: 1px solid rgba(120, 214, 163, 0.3);
  color: var(--success);
}

.status-pill.pending {
  background: rgba(244, 171, 110, 0.12);
  border-color: rgba(244, 171, 110, 0.3);
  color: var(--accent-soft);
}

.tiny-note,
.status-note {
  color: var(--muted);
  font-size: 0.95rem;
}

.error-box,
.success-box,
.empty-state,
.result-box {
  display: grid;
  gap: 14px;
}

.error-box,
.success-box {
  padding: 14px 16px;
  border-radius: 18px;
}

.error-box {
  background: rgba(189, 71, 71, 0.16);
  border: 1px solid rgba(189, 71, 71, 0.32);
}

.success-box {
  background: rgba(120, 214, 163, 0.14);
  border: 1px solid rgba(120, 214, 163, 0.28);
}

.result-box p {
  white-space: pre-wrap;
}

.dashboard-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 20px;
}

.detail-panel {
  display: grid;
  gap: 24px;
}

.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.detail-grid div {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
}

.ghost-link {
  color: var(--muted);
}

@media (max-width: 900px) {
  .hero-grid,
  .reading-layout,
  .dashboard-grid,
  .feature-grid,
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 64px;
  }

  .nav-row,
  .footer-row {
    flex-direction: column;
    justify-content: center;
    padding: 18px 0;
  }
}

@media (max-width: 640px) {
  .container {
    width: min(100% - 24px, 1120px);
  }

  .page-section {
    padding: 52px 0;
  }

  .panel {
    padding: 22px;
    border-radius: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .site-nav,
  .hero-actions,
  .action-row {
    width: 100%;
  }

  .site-nav {
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-actions > *,
  .action-row > * {
    width: 100%;
  }
}
