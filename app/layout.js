import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import LogoutButton from "@/components/LogoutButton";
import { getSessionUser } from "@/lib/auth";

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
  description: "Free-beta astrology chat with login and saved history.",
};

export default async function RootLayout({ children }) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <div className="site-shell">
          <header className="site-header">
            <div className="container nav-row">
              <div className="brand-wrap">
                <Link href="/" className="brand">
                  Drishti AI
                </Link>
                <p className="site-tagline">Free beta astrology workspace with saved chats</p>
              </div>

              <nav className="nav-actions">
                <Link href="/" className="nav-link">
                  Home
                </Link>
                {user ? (
                  <>
                    <Link href="/chat" className="secondary-button">
                      Open workspace
                    </Link>
                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Link href="/login" className="nav-link">
                      Login
                    </Link>
                    <Link href="/signup" className="secondary-button">
                      Create free account
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="site-footer">
            <div className="container footer-row">
              <p>Built for a free launch today, with a clean path to premium later.</p>
              <Link href={user ? "/chat" : "/signup"}>Start with the free beta</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
