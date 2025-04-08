"use client";
import React from "react";
import Link from "next/link";
import PostListPage from "../components/PostList";
import ProfileBlogLoop from "../components/ProfileBlogLoop";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LocationListPage from "../components/LocationsList";

// Reusable Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <p className="text-xl font-medium text-gray-600 animate-pulse">Loading...</p>
  </div>
);

// Reusable Button Component for Admin Actions
const AdminActionButton = ({ href, label }) => (
  <Link href={href}>
    <button
      aria-label={label}
      className="bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
    >
      {label}
    </button>
  </Link>
);

export default function ManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading state
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // Fallback for session data
  const userEmail = session?.user?.email || "User";
  const userRole = session?.user?.role || "user";

  return (
    <div className="min-h-screen py-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
              Welcome, {userEmail}
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-gray-900">
              Manage Your Content
            </h2>
            <p className="mt-2 text-gray-500">
              Create and manage your routes, blog posts, and location posts.
            </p>
          </div>

          {/* Action Buttons (Show Only if Admin) */}
          {userRole === "admin" && (
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <AdminActionButton href="/map/add" label="Create Route" />
              <AdminActionButton href="/profile/posts/add" label="Create Blog Post" />
              <AdminActionButton href="/locations/add" label="Create Location Post" />
            </div>
          )}

          {/* Content Lists */}
          <div className="space-y-12">
            <LocationListPage />
            <PostListPage />
            <ProfileBlogLoop />
          </div>
        </div>
      </div>
    </div>
  );
}