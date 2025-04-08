"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePageHero() {
  // State for parallax effect
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const buttonHover = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {/* Hero Section with Parallax Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <Image
            src="/map.jpg"
            alt="Cycling route map background"
            fill
            className="object-cover brightness-40 scale-110"
            priority
            quality={90}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <motion.div
          className="relative z-10 max-w-5xl mx-auto flex flex-col justify-center text-white px-6"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-xl"
            variants={fadeIn}
          >
            <span className="text-sky-400">Explore</span> Roads{" "}
            <br className="hidden md:block" />
            I&apos;ve Ridden <span className="text-sky-400">&</span> Recommend
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl max-w-2xl mb-8 text-gray-200 font-light leading-relaxed"
            variants={fadeIn}
          >
            Discover my handpicked recommendations for the safest and most
            enjoyable bike routes around the city.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={fadeIn}
          >
            <motion.div whileHover="hover" variants={buttonHover}>
              <Link
                href="/map"
                className="group flex items-center px-8 py-4 text-base font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors shadow-xl"
              >
                Find Top Routes
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </motion.div>

            <motion.div whileHover="hover" variants={buttonHover}>
              <Link
                href="mailto:nityahoyos@gmail.com"
                className="group flex items-center px-8 py-4 text-base font-medium text-sky-600 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Submit A Route
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </motion.div>
      </section>

      {/* Map CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-white">
              <span className="inline-block px-4 py-1 rounded-full bg-sky-900/50 text-sky-400 text-sm font-medium mb-4">
                INTERACTIVE EXPERIENCE
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Explore?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Jump straight into our interactive map and discover the best
                cycling routes in your area. Plan your next adventure with
                confidence.
              </p>
              <Link
                href="/map"
                className="group inline-flex items-center px-8 py-4 text-base font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
              >
                Discover Your Routes
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <Image
                src="/map.jpg"
                alt="Interactive map preview"
                fill
                className="object-cover scale-110 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading Section */}
          <motion.div
            className="text-center mb-20 flex flex-col items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-sky-100 text-sky-600 text-sm font-medium mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl md:text-5xl text-gray-800 font-bold mb-6">
              Unlock the Joy of Safe Biking
            </h2>
            <div className="w-24 h-1 bg-sky-500 mb-8"></div>
            <p className="mt-4 text-xl text-gray-700 max-w-3xl leading-relaxed">
              Discover top-rated bike routes and plan your rides with
              confidence. Focus on the journey while we guide you to safer,
              smarter, and more enjoyable adventures.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-16">
            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-700 grid md:grid-cols-2 items-center rounded-xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-sky-600 mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    ></path>
                  </svg>
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Find Your Perfect Route
                </h3>
                <div className="w-16 h-1 bg-sky-500 mb-6"></div>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Navigate confidently with our carefully rated routes, designed
                  to help you avoid high-traffic areas and risky intersections.
                  Find paths that prioritize your safety and enjoyment.
                </p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-sky-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Safety-rated intersections
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-sky-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Traffic-free alternatives
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-sky-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Scenic viewpoints
                  </li>
                </ul>
              </div>
              <div className="relative h-full min-h-96 group w-full">
                <Image
                  src="/mapitem.jpg"
                  alt="Bike route map"
                  fill
                  className="object-cover scale-105  transition-transform duration-700"
                />
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-700 grid md:grid-cols-2 items-center rounded-xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-full min-h-96 md:order-2 group">
                <Image
                  src="/map.jpg"
                  alt="Customized cycling route"
                  fill
                  className="object-cover scale-105  transition-transform duration-700"
                />
              </div>
              <div className="p-10 lg:p-16 md:order-1">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-sky-600 mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    ></path>
                  </svg>
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Customize Your Ride
                </h3>
                <div className="w-16 h-1 bg-sky-500 mb-6"></div>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Plan your journey with routes tailored to your preferences.
                  Avoid busy streets, find well-lit paths, and create a ride
                  that fits your schedule and safety needs.
                </p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-sky-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Personalized route options
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-sky-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Difficulty level filters
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-sky-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Save favorite routes
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Call-to-Action Button */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/map"
              className="group inline-flex items-center px-10 py-5 text-lg font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-all duration-300 shadow-xl transform"
            >
              Start Exploring Now
              <svg
                className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
