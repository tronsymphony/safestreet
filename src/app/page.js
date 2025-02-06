'use client';
// homepage
import React, { useState, useEffect } from 'react';
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import MapboxDrawComponent from "./components/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import HomePageHero from "./components/home-page-hero";
import { getSession } from "next-auth/react";
import Script from "next/script";
import { Inter } from 'next/font/google';

// Fetch post by slug
async function fetchPost(slug) {
  const res = await fetch(`/api/regularPosts?slug=${slug}`);
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return post;
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', 
});

export default function Home({ params }) {
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const init = async () => {
      const userSession = await getSession(); // Check if user is logged in
      setSession(userSession || null); // Allow null session for non-logged-in users

      // try {
      //   const fetchedPost = await fetchPost(slug, userSession.id);
      //   setPost(fetchedPost);
      //   setLikeCount(fetchedPost.like_count || 0);
      //   setIsLiked(fetchedPost.user_has_liked || false); // Set initial like state
      // } catch (err) {
      //   console.error(err);
      //   setError("Failed to load the post.");
      // } finally {
      //   setLoading(false);
      // }
    };

    init();
  }, [slug]);

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-VDT7TFFJ12`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];  
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VDT7TFFJ12', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <main className={`${styles.main} ${inter.className}`}>

        <HomePageHero></HomePageHero>
        {/* <MapboxDrawComponent session={session}></MapboxDrawComponent> */}
      </main>
    </>

  );
}
