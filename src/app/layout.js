'use client'
import { useEffect, useState } from 'react';
// import { verifyToken } from '../lib/auth';
import jwt from 'jsonwebtoken';  // Make sure to import jwt correctly

import { Manrope } from "next/font/google";
import "./globals.scss";
import Link from 'next/link'
import styles from "./page.module.scss";
import cookie from 'js-cookie';


const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal'],
  display: 'swap',
});

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };


export default function RootLayout({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const token = cookie.get('token');
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setSession(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        setSession(null);
      }
    }
  }, []);

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
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0">
                    <g>
                      <path d="m50.562 34.258c3.6758 0 6.7539-2.5742 7.543-6.0156 0.12891-0.55859 0.20312-1.1328 0.20312-1.7305 0-4.2695-3.4727-7.7461-7.7461-7.7461-4.2695 0-7.7422 3.4766-7.7422 7.7461 0 1.7852 0.61328 3.4258 1.6328 4.7344 1.4141 1.8281 3.6211 3.0117 6.1094 3.0117zm0-13.789c3.332 0 6.043 2.7109 6.043 6.043 0 0.75781-0.14453 1.4805-0.40234 2.1484-0.86719 2.2734-3.0664 3.8945-5.6406 3.8945-1.6406 0-3.1289-0.66016-4.2188-1.7227-1.125-1.0977-1.8242-2.6289-1.8242-4.3203 0-3.332 2.7109-6.043 6.043-6.043z" />
                      <path d="m27.285 62.133c1.832 0 3.3633-1.2891 3.7539-3.0039h40.809c1.9023 0 3.4492 1.5469 3.4492 3.4492s-1.5469 3.4492-3.4492 3.4492v0.023437l-12.496-0.003906c-0.39062-1.7148-1.9219-3.0039-3.7539-3.0039-1.832 0-3.3633 1.2891-3.7539 3.0039h-14.812c-5.8438 0-10.594 4.7539-10.594 10.594 0 5.8438 4.7539 10.594 10.594 10.594h19.484c0.47266 1.5938 1.9336 2.7656 3.6797 2.7656 2.125 0 3.8555-1.7305 3.8555-3.8555s-1.7305-3.8555-3.8555-3.8555c-1.9141 0-3.4961 1.4102-3.793 3.2422l-19.371 0.007812c-4.9062 0-8.8945-3.9883-8.8945-8.8945s3.9883-8.8945 8.8945-8.8945h14.812c0.39062 1.7148 1.9219 3.0039 3.7539 3.0039 1.832 0 3.3633-1.2891 3.7539-3.0039h13.082v-0.082031c2.5625-0.29688 4.5625-2.4531 4.5625-5.0898s-2.0039-4.7969-4.5625-5.0898v-0.058593h-0.58594l-20.957-0.003907 0.39453-0.63281c0.38672-0.62109 6.9258-11.188 10.863-20.383h6.5312c0.39062 1.7188 1.9219 3.0039 3.7539 3.0039 1.832 0 3.3633-1.2891 3.7539-3.0039h4.0508c3.8281 0 6.9453-3.1172 6.9453-6.9453 0-3.7461-2.9844-6.8008-6.6953-6.9336v-0.011719h-12.852v1.7031h12.602c2.8906 0 5.2461 2.3516 5.2461 5.2461 0 2.8906-2.3516 5.2422-5.2461 5.2422h-4.0508c-0.39062-1.7148-1.9219-3.0039-3.7539-3.0039-1.832 0-3.3633 1.2891-3.7539 3.0039h-5.8281c1.2188-3.0586 2.0703-5.8711 2.2148-8 0.003906-0.046876 0.011719-0.097657 0.011719-0.14063v-1.2812c0-4.3516-1.9297-8.4375-5.2891-11.211-3.3594-2.7695-7.7812-3.875-12.137-3.0312-5.6992 1.1094-10.258 5.6875-11.344 11.395-0.23828 1.25-0.32031 2.5156-0.24609 3.7031v0.80469c0.046875 1.4805 0.60156 3.5117 1.4531 5.8242 0.23047 0.62891 0.48047 1.2734 0.75391 1.9375h-13.414c-6.7305 0-12.207 5.4766-12.207 12.207 0 6.2734 4.7578 11.453 10.855 12.129 0.36328 1.7578 1.9219 3.0859 3.7812 3.0859zm2.1562-3.8555c0 0.30078-0.0625 0.58984-0.17578 0.85156-0.33203 0.76562-1.0898 1.3047-1.9766 1.3047-0.88672 0-1.6484-0.53906-1.9766-1.3047-0.11328-0.26172-0.17578-0.54688-0.17578-0.85156 0-0.30078 0.0625-0.58984 0.17578-0.85156 0.33203-0.76562 1.0938-1.3047 1.9766-1.3047 0.88672 0 1.6484 0.53906 1.9766 1.3047 0.11328 0.26172 0.17578 0.54688 0.17578 0.85156zm28.133 9.4727c-0.33203 0.76562-1.0898 1.3047-1.9766 1.3047-0.88672 0-1.6484-0.53906-1.9766-1.3047-0.11328-0.26172-0.17578-0.54688-0.17578-0.85156 0-0.30078 0.0625-0.58984 0.17578-0.85156 0.33203-0.76562 1.0938-1.3047 1.9766-1.3047 0.88672 0 1.6445 0.53906 1.9766 1.3047 0.11328 0.26172 0.17578 0.54688 0.17578 0.85156 0 0.30469-0.0625 0.58984-0.17578 0.85156zm0.46875 18.398c0-0.21484 0.039062-0.41797 0.097656-0.61328 0.26562-0.88672 1.082-1.5391 2.0547-1.5391 1.1875 0 2.1523 0.96484 2.1523 2.1523s-0.96484 2.1562-2.1523 2.1562c-0.78906 0-1.4727-0.42969-1.8477-1.0664-0.15234-0.25391-0.24609-0.54297-0.28125-0.85156-0.011718-0.078125-0.023437-0.15625-0.023437-0.23828zm-27.004-28.723c-0.39062-1.7188-1.9219-3.0039-3.7539-3.0039-0.92188 0-1.7617 0.33984-2.4258 0.88281-0.62891 0.51562-1.0938 1.2188-1.3008 2.0312-5.1797-0.64453-9.207-5.0664-9.207-10.418 0-5.793 4.7148-10.508 10.508-10.508h14.141c3.9258 8.9492 10.445 19.734 10.836 20.375l0.38672 0.64062zm6.7266-31.332c-0.066406-1.1016 0.003906-2.2227 0.21484-3.332 0.95703-5.0312 4.9766-9.0664 10-10.043 0.85156-0.16406 1.7031-0.24609 2.5469-0.24609 2.9844 0 5.8672 1.0117 8.1797 2.918 2.9688 2.4492 4.6719 6.0547 4.6719 9.8984v1.2109c-0.011718 0.19141-0.03125 0.39062-0.054687 0.59375-0.23828 2.043-1.1094 4.7188-2.3047 7.6172-0.11719 0.28125-0.23438 0.56641-0.35547 0.85156-0.12109 0.28125-0.24219 0.56641-0.36719 0.85156-3.1836 7.2266-7.9258 15.293-9.7266 18.285-1.793-3.0352-6.5391-11.238-9.7227-18.285-0.12891-0.28516-0.25391-0.57031-0.37891-0.85156-0.125-0.28516-0.25-0.57031-0.36719-0.85156-0.33594-0.79297-0.64844-1.5625-0.92578-2.3008-0.82812-2.207-1.3633-4.125-1.4102-5.4844zm32.516 9.4688c0-0.30078 0.0625-0.58984 0.17578-0.85156 0.33203-0.76563 1.0898-1.3047 1.9766-1.3047 0.88672 0 1.6445 0.53906 1.9766 1.3047 0.11328 0.26172 0.17578 0.54687 0.17578 0.85156 0 0.30078-0.0625 0.58984-0.17578 0.85156-0.33203 0.76563-1.0898 1.3047-1.9766 1.3047-0.88672 0-1.6445-0.53906-1.9766-1.3047-0.11328-0.26172-0.17578-0.54687-0.17578-0.85156z" />
                    </g>
                  </svg>
                </span>
                Safe Streets Map
              </Link>
            </div>
            <nav className="nav">
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/map">Map</Link></li>
                <li><Link href="/press">Press</Link></li>

                {session ? (
                  <>
                    <li><Link href="/profile">Profile</Link></li>
                    <li>
                      <button
                        onClick={() => {
                          cookie.remove('token');
                          setSession(null);
                          window.location.href = '/';
                        }}
                      >
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
              <Link href="/">
                Safe Streets Map
              </Link>
              <Link href="/">
                Terms of Service. Privacy Policy.
              </Link>
            </div>

            <p>&copy; {new Date().getFullYear()} Safe Streets Map</p>

          </div>
        </footer>
      </body>
    </html>
  );
}
