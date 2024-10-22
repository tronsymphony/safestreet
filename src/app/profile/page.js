'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostListPage from '../components/PostList';
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-semibold text-center">Welcome, {session.user.email}</h1>
      <h2 className="text-4xl font-bold mt-10 text-center">Manage Your Content</h2>

      <div className="mt-10 grid grid-cols-1 gap-8">
        <div>
          {/* PostList component */}
          <PostListPage />
        </div>

        {session?.role === 'admin' && (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Your Routes</h3>
            <Link href="/map/edit">
              <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                Add Routes
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
