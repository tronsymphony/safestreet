'use client';

import { SessionProvider, useSession, signOut } from "next-auth/react";
import "./globals.scss";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from "./page.module.scss";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <RootContent>{children}</RootContent>
    </SessionProvider>
  );
}

function RootContent({ children }) {
  const { data: session, status } = useSession();  // Get session data
  const router = useRouter();

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
      <body className=" text-gray-800">
        
        <header className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center ox">
            <div className={styles.logo + " flex items-center font-bold text-xl"}>
              <Link href="/" className="hover:text-sky-700 text-sm transition">
                Safe Streets Map
              </Link>
            </div>
            <nav className="flex gap-6 text-lg items-center">
              <Link href="/about" className="hover:text-sky-700 text-sm transition">About</Link>
              <Link href="/blog" className="hover:text-sky-700 text-sm transition">Blog</Link>
              <Link href="/map" className="hover:text-sky-700 text-sm transition">Map</Link>
              {status === "authenticated" ? (
                <>
                  <Link href="/profile" className="hover:text-sky-700 text-sm transition">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="hover:bg-sky-700 hover:text-white py-2 text-sm text-sky-700 rounded transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-sky-700 text-sm transition">Login</Link>
                  <Link href="/signup" className="hover:bg-sky-700 hover:text-white  py-2 text-sm text-sky-700 rounded transition">
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 py-8 text-white">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
            <div className="text-lg font-bold">
              <Link href="/" className="hover:text-sky-700 text-sm transition">
                Safe Streets Map
              </Link>
            </div>
            <div>
              <Link href="/" className="hover:text-sky-700 text-sm transition">Terms of Service</Link> |{" "}
              <Link href="/" className="hover:text-sky-700 text-sm transition">Privacy Policy</Link>
            </div>
            <p className="text-sm text-white-500">&copy; {new Date().getFullYear()} Safe Streets Map</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
