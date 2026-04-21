import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Drishti AI",
  description: "Drishti AI offers free astrology, numerology, tarot and kundli readings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <div className="site-shell">
          <header className="site-header">
            <div className="container nav-row">
              <Link href="/" className="brand">
                Drishti AI
              </Link>

              <nav className="site-nav">
                <Link href="/reading">Reading Room</Link>
                <Link href="/dashboard">Guide</Link>
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="site-footer">
            <div className="container footer-row">
              <p>Built for simple GitHub upload and Vercel deployment.</p>
              <Link href="/reading">Open free readings</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
