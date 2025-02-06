"use client";

import React from "react";
import styles from "../page.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function HomePageHero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-14">
        <div className="w-full h-full bg-black bg-opacity-60"></div>
        <div className=" flex flex-col justify-center items-center text-center text-white px-4">
          <h2 className="text-3xl md:text-5xl font-light mb-4 max-w-4xl text-center">
            Explore Roads I&apos;ve Ridden and Recommend
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-6 text-center font-light">
            Discover my handpicked recommendations for the safest and most
            enjoyable bike routes around the city.
          </p>
          <div className="flex gap-4">
            <Link
              href="/map"
              className="px-4 py-3 text-sm font-semibold text-white bg-sky-500 rounded-md hover:bg-white hover:text-black transition"
            >
              Find Top Routes
            </Link>
            <Link
              href="mailto:nityahoyos@gmail.com"
              className="px-4 py-3 text-sm font-semibold text-white bg-sky-500 rounded-md hover:bg-white hover:text-black transition"
            >
              Submit A Route
            </Link>
          </div>
        </div>
      </section>

      <section className="relative">
        <Image
          src={"/map.jpg"}
          alt=""
          className="w-full h-96 object-cover"
          width={1000}
          height={200}
        />
        <div className="bg inset-0 absolute bg-slate-900 bg-opacity-90"></div>
        <div className="inset-0 absolute flex justify-center items-center">
          <Link
            href="/map"
            className="inline-block px-4 py-3 text-sm font-semibold text-white bg-sky-500 rounded-md hover:bg-sky-600 transition-colors "
          >
            Discover Your Routes
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading Section */}
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-4xl text-white font-light">
              Unlock the Joy of Safe Biking
            </h2>
            <p className="mt-4 text-xl text-white max-w-3xl font-light">
              Discover top-rated bike routes and plan your rides with
              confidence. Focus on the journey while we guide you to safer,
              smarter, and more enjoyable adventures.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-10">
            <div className="bg-slate-800  grid md:grid-cols-2  items-center rounded-lg overflow-hidden">
              <div className="block p-10">
                <h3 className="text-4xl font-light text-gray-100 mb-2">
                  Find the Your Routes
                </h3>
                <p className="text-gray-200 font-light">
                  Navigate confidently with our carefully rated routes, designed
                  to help you avoid high-traffic areas and risky intersections.
                  Find paths that prioritize your safety and enjoyment.
                </p>
              </div>
              <Image
              width={500}
              height={500}
                src="/mapitem.jpg"
                className="w-full h-96 h-auto object-cover"
                alt=""
              />
            </div>

            <div className="bg-slate-800  grid md:grid-cols-2  items-center rounded-lg overflow-hidden">
            <Image
              width={500}
              height={500}
                src="/map.jpg"
                className="w-full h-96 h-auto object-cover"
                alt=""
              />
              <div className="block p-10">
                <h3 className="text-4xl font-light text-gray-100 mb-2">
                  Customize Your Ride
                </h3>
                <p className="text-gray-200 font-light">
                  Plan your journey with routes tailored to your preferences.
                  Avoid busy streets, find well-lit paths, and create a ride
                  that fits your schedule and safety needs.
                </p>
              </div>
            </div>
          </div>

          {/* Call-to-Action Button */}
          <div className="text-center mt-12">
            <Link
              href="/map"
              className="inline-block px-4 py-3 text-sm font-semibold text-white bg-sky-500 rounded-md hover:bg-sky-600 transition-colors"
            >
              Discover Your Routes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
