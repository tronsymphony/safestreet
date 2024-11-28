"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PostListPage from "../components/PostList";
import ProfileBlogLoop from "../components/ProfileBlogLoop";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LocationListPage from "../components/LocationsList";

export default function ManagePage() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.push("/auth/signin");
      } else {
        setSession(session);
      }
    });
  }, [router]);

  if (!session) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-16 px-6 md:px-10">
      <div className="bg-white  rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800">
          Welcome, {session.user.email}
        </h1>
        <h2 className="text-4xl font-bold mt-6 text-center text-gray-900">
          Manage Your Content
        </h2>

        <div className="flex gap-2 justify-between max-w-xl mx-auto">
          {session?.role === "admin" && (
            <div className="mt-12">
              <Link href="/map/edit">
                <button className="bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-700 transition-shadow  hover:shadow-lg">
                  Create Route
                </button>
              </Link>
            </div>
          )}

          {session?.role === "admin" && (
            <div className="mt-12">

              <Link href="profile/posts/edit">
                <button className="bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-700 transition-shadow  hover:shadow-lg">
                  Create Blog Post
                </button>
              </Link>
            </div>
          )}

          {session?.role === "admin" && (
            <div className="mt-12">
              <Link href="/locations/edit">
                <button className="bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-700 transition-shadow  hover:shadow-lg">
                  Create Location Post
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12">
          <LocationListPage />
        </div>

        <div className="mt-12">
          <PostListPage />
        </div>
        <div className="mt-12">
          <ProfileBlogLoop />
        </div>
      </div>
    </div>
  );
}
