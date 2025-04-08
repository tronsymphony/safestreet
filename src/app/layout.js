"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import "./globals.scss";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <RootContent>{children}</RootContent>
    </SessionProvider>
  );
}

function RootContent({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items for both desktop and mobile
  const navItems = [
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Map", path: "/map" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Safe Streets Map</title>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <header className={`${scrolled ? 'shadow-md bg-white' : 'bg-white/90'} sticky top-0 z-50 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
                <Image
                  src="/stm.webp"
                  alt="Safe Streets Map"
                  className="size-10 md:size-12"
                  width={100}
                  height={100}
                  priority
                />
                <span className="font-bold uppercase text-sm md:text-base tracking-wider text-slate-800 hidden sm:block">
                  Safe Streets Map
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-8 space-x-6 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-xs font-semibold uppercase transition-colors duration-300 ${
                    pathname === item.path
                      ? 'text-sky-600 border-b-2 border-sky-600 pb-1'
                      : 'text-slate-700 hover:text-sky-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Auth Navigation - Desktop */}
            <nav className="ml-auto hidden md:flex items-center space-x-4">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-xs font-semibold uppercase transition-colors duration-300 text-slate-700 hover:text-sky-600"
                  >
                    <FaUser size={14} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors duration-300"
                  >
                    <FaSignOutAlt size={14} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-xs font-semibold uppercase text-sky-600 hover:text-sky-700 transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-xs font-semibold uppercase rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-slate-700 ml-auto p-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Mobile Navigation Menu - Slide down animation */}
          <div 
            className={`md:hidden absolute w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ${
              isMobileMenuOpen 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <nav className="flex flex-col p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`py-3 text-sm font-medium transition-colors ${
                    pathname === item.path
                      ? 'text-sky-600'
                      : 'text-slate-700 hover:text-sky-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-gray-200 my-3"></div>
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/profile"
                    className="py-3 flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
                  >
                    <FaUser size={14} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-3 flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    <FaSignOutAlt size={14} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="py-3 text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="mt-2 px-4 py-2 text-sm font-medium rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors text-center"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Column */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/stm.webp"
                    alt="Safe Streets Map"
                    className="size-10"
                    width={100}
                    height={100}
                  />
                  <span className="font-bold uppercase text-sm tracking-wider">
                    Safe Streets Map
                  </span>
                </div>
                <p className="text-gray-300 text-sm">
                  Helping cyclists find safe and enjoyable routes throughout the city
                  with community-driven recommendations.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-bold uppercase mb-4">Quick Links</h3>
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      className="text-gray-300 hover:text-sky-400 text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-sm font-bold uppercase mb-4">Legal</h3>
                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/terms"
                    className="text-gray-300 hover:text-sky-400 text-sm transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-sky-400 text-sm transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </nav>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Safe Streets Map. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <Link
                  href="mailto:contact@safestreetsmap.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  contact@safestreetsmap.com
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}