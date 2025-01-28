"use client";

import React from "react";
import styles from "../page.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function HomePageHero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Image
          width="1600"
          height="900"
          alt="Scenic city bike route"
          src="https://images.pexels.com/photos/172484/pexels-photo-172484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          className="object-cover w-full h-[400px]"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
          <h2 className="text-5xl font-bold mb-4">Explore the Best City Routes</h2>
          <p className="text-lg max-w-xl mx-auto mb-6">
            Discover my handpicked recommendations for the safest and most enjoyable bike routes around the city. Plan your rides with confidence and ease.
          </p>
          <div className="flex gap-4">
            <Link
              href="/map"
              className="px-6 py-2 text-sm font-semibold capitalize bg-sky-500 text-white rounded-full hover:bg-white hover:text-black transition"
            >
              Find Top Routes
            </Link>
            {/* <Link
              href="/map"
              className="px-6 py-2 text-sm font-semibold capitalize bg-sky-500 text-white rounded-full hover:bg-white hover:text-black transition"
            >
              Submit Your Route
            </Link> */}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Unlock the Joy of Safe Biking
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover top-rated bike routes and plan your rides with confidence. Focus on the journey while we guide you to safer, smarter, and more enjoyable adventures.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Safest Route */}
            <div className="bg-slate-100 p-4 rounded-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Choose the Safest Routes
              </h3>
              <p className="text-gray-600">
                Navigate confidently with our carefully rated routes, designed to help you avoid high-traffic areas and risky intersections. Find paths that prioritize your safety and enjoyment.
              </p>
            </div>

            {/* Feature 2: Plan Your Ride */}
            <div className="bg-slate-100 p-4 rounded-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Customize Your Ride
              </h3>
              <p className="text-gray-600">
                Plan your journey with routes tailored to your preferences. Avoid busy streets, find well-lit paths, and create a ride that fits your schedule and safety needs.
              </p>
            </div>

            {/* Feature 3: Ride with Confidence */}
            <div className="bg-slate-100 p-4 rounded-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Stay Informed as You Ride
              </h3>
              <p className="text-gray-600">
                Ride with peace of mind using real-time updates. Adjust your route on the go to ensure a smooth, secure, and enjoyable experience from start to finish.
              </p>
            </div>
          </div>

          {/* Call-to-Action Button */}
          <div className="text-center mt-12">
            <Link
              href="/map"
              className="inline-block px-8 py-3 text-lg font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors"
            >
              Discover Your Perfect Route
            </Link>
          </div>
        </div>
      </section>


      {/* Local Routes Section */}
      <section className="py-4 mb-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold capitalize mb-2">
            Safest Bike Routes Near Los Angeles
          </h2>
          <p className="text-gray-600">
            Discover my personally rated bike routes around Los Angeles, carefully chosen for their safety and enjoyable riding experience.
          </p>
        </div>
      </section>

    </>
  );
}
