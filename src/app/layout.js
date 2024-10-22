'use client';

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import "./globals.scss";
import Link from 'next/link';
import styles from "./page.module.scss";
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <RootContent>{children}</RootContent>
    </SessionProvider>
  );
}

function RootContent({ children }) {
  const { data: session, status } = useSession();  // Get session data

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });  // Use NextAuth's signOut
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Safe Streets Map</title>
      </head>
      <body>
        <header className="main-header px-2 py-6">
          <div className="max-w-6xl mx-auto flex justify-between">
            <div className={styles.logo}>
              <Link href="/">
                Safe Streets Map
              </Link>
            </div>
            <nav className="nav">
              <ul className="flex gap-4">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/map">Map</Link></li>
                {status === "authenticated" ? (
                  // Show these links if the user is authenticated
                  <>
                    <li><Link href="/profile">Profile</Link></li>
                    <li>
                      <button onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  // Show login and signup links if the user is not authenticated
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
