'use client'
import { useSession, SessionProvider } from '../lib/SessionContext';
import { Manrope } from "next/font/google";
import "./globals.scss";
import Link from 'next/link'
import styles from "./page.module.scss";
import { useRouter } from 'next/navigation'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <RootContent>{children}</RootContent>
    </SessionProvider>
  );
}

function RootContent({ children }) {
  const { session, setSession } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'; // Remove cookie
    setSession(null); // Clear session in context
    router.push('/'); // Redirect to home page
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Safe Streets Map</title>
      </head>
      <body className={manrope.className}>
        <header className="main-header">
          <div className="container">
            <div className={styles.logo}>
              <Link href="/">
                Safe Streets Map
              </Link>
            </div>
            <nav className="nav">
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/map">Map</Link></li>
                {session ? (
                  <>
                    <li><Link href="/profile">Profile</Link></li>
                    <li>
                      <button onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link href="/login">Login</Link></li>
                    <li><Link href="/signup">Sign up</Link></li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <div className="content">
          {children}
        </div>
        <footer className="main-footer">
          <div className="container">
            <div className={styles.logo}>
              <Link href="/">Safe Streets Map</Link>
              <Link href="/">Terms of Service. Privacy Policy.</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} Safe Streets Map</p>
          </div>
        </footer>
      </body>
    </html>
  );
}