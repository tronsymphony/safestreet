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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
              Welcome, {session.user.email}
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-gray-900">
              Manage Your Content
            </h2>
            <p className="mt-2 text-gray-500">
              Create and manage your routes, blog posts, and location posts.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {session?.role === "admin" && (
              <>
                <Link href="/map/add">
                  <button className="bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                    Create Route
                  </button>
                </Link>
                <Link href="/profile/posts/add">
                  <button className="bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                    Create Blog Post
                  </button>
                </Link>
                <Link href="/locations/add">
                  <button className="bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                    Create Location Post
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Content Lists */}
          <div className="space-y-12">
            <div className="">
              <LocationListPage />
            </div>

            <div className="">
              <PostListPage />
            </div>

            <div className="">
              <ProfileBlogLoop />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}