"use client"; // Mark this component as a Client Component

import { SessionProvider, useSession, signOut } from "next-auth/react";
import "./globals.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useState } from "react"; // Add useState for mobile menu toggle
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for hamburger and close
import Image from "next/image";
import { Inter } from 'next/font/google';

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <RootContent>{children}</RootContent>
    </SessionProvider>
  );
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', 
});

function RootContent({ children }) {
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Use NextAuth's signOut
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle mobile menu
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Safe Streets Map</title>
      </head>
      <body className={`text-gray-800 ${inter.className}`}>
        <header className="">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-start items-center">
            <div className={styles.logo + " flex items-center font-bold"}>
              <Link href="/" className=" font-bold uppercase flex gap-4">
                <Image
                  src="/stm.webp"
                  alt="safe streets map"
                  className="size-14"
                  width={100}
                  height={100}
                />

                <div className="font-bold uppercase flex text-base">Safe Streets Map</div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-4 text-base items-center pl-4">
              <Link
                href="/about"
                className="hover:text-sky-700 text-xs transition font-bold uppercase"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="hover:text-sky-700 text-xs transition font-bold uppercase"
              >
                Blog
              </Link>
              <Link
                href="/map"
                className="hover:text-sky-700 text-xs transition font-bold uppercase"
              >
                Map
              </Link>
              <Link
                href="/contact"
                className="hover:text-sky-700 text-xs transition font-bold uppercase"
              >
                Contact
              </Link>
            </nav>
            <nav className="account ml-auto  gap-4 items-center hidden md:flex">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/profile"
                    className="hover:text-sky-700 text-xs transition font-bold uppercase"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-sky-700 py-2 text-xs text-sky-700 rounded transition font-bold uppercase"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hover:text-sky-700 text-xs transition font-bold uppercase"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="py-2 text-xs  rounded transition font-bold uppercase"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-sky-700 focus:outline-none ml-auto"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white">
              <nav className="flex flex-col gap-4 p-4">
                <Link
                  href="/about"
                  className="hover:text-sky-700 text-sm transition"
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="hover:text-sky-700 text-sm transition"
                >
                  Blog
                </Link>
                <Link
                  href="/map"
                  className="hover:text-sky-700 text-sm transition"
                >
                  Map
                </Link>
                {status === "authenticated" ? (
                  <>
                    <Link
                      href="/profile"
                      className="hover:text-sky-700 text-sm transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="hover:bg-sky-700 hover:text-white py-2 text-sm text-sky-700 rounded transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="hover:text-sky-700 text-sm transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="hover:bg-sky-700 hover:text-white py-2 text-sm text-sky-700 rounded transition"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-800 py-8 text-white">
          <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap px-4">
            <div className="text-lg font-bold">
              <Link
                href="/"
                className="hover:text-sky-700 text-sm transition font-bold uppercase"
              >
                Safe Streets Map
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="hover:text-sky-700 text-sm transition font-bold uppercase"
              >
                Terms of Service
              </Link>{" "}
              |{" "}
              <Link
                href="/"
                className="hover:text-sky-700 text-sm transition font-bold uppercase"
              >
                Privacy Policy
              </Link>
            </div>
            <p className="text-sm text-white-500">
              &copy; {new Date().getFullYear()} Safe Streets Map
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
