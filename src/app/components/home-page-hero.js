'use client';

import React from "react";
import styles from "../page.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function HomePageHero() {
    return (
        <>
            {/* Hero Section */}
            <section className={`relative overflow-hidden`}>
                <Image
                    width="1600"
                    height="900"
                    alt="City route image"
                    src="https://images.pexels.com/photos/172484/pexels-photo-172484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    className="object-cover w-full h-[400px] "
                />
                <div className="absolute bg-black top-0 left-0 w-full h-full bg-opacity-60"></div>
                <div className={`absolute inset-0 flex flex-col justify-center items-center text-center text-white `}>
                    <h2 className="text-5xl font-bold mb-4">Discover City Routes</h2>
                    <p className="text-lg max-w-xl mx-auto mb-6">
                        A Curated List of Roads That are recommended routes for getting around the city.
                    </p>
                    <Link href="/map" className="hover:bg-white hover:text-black px-6 py-2 text-sm capitalize font-semibold bg-sky-500 text-white rounded-full transition">
                        Find the best routes
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="">
                <div className="max-w-6xl mx-auto py-16 px-2">
                    <div className={`flex items-center justify-center mb-16`}>
                        <h2 className="text-4xl font-bold leading-tight text-center">
                            We want you to have more fun on your bike.<br /> Ride in new places, and let us take care of the detail.
                        </h2>
                    </div>

                    <div className={` grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto`}>
                        <div className="bg-slate-100 p-6 rounded-md">
                            <h3 className="text-xl font-semibold mb-2">Find the Safest Route</h3>
                            <p className="text-gray-600">
                                Explore the safest routes through the city with our advanced mapping tools. Whether you're biking, walking, or driving, our app helps you avoid high-traffic areas and dangerous intersections.
                            </p>
                        </div>

                        <div className="bg-slate-100 p-6 rounded-md">
                            <h3 className="text-xl font-semibold mb-2">Plan Your Journey</h3>
                            <p className="text-gray-600">
                                Customize your route to prioritize safety. Use our planner to avoid busy roads, find well-lit streets, and choose paths that are best suited for your journey, no matter the time of day.
                            </p>
                        </div>

                        <div className="bg-slate-100 p-6 rounded-md">
                            <h3 className="text-xl font-semibold mb-2">Navigate with Confidence</h3>
                            <p className="text-gray-600">
                                Set off on your route knowing you've chosen the safest path. Our app provides real-time updates on your route, helping you adjust on the go to stay on the safest track.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/map" className="hover:bg-white hover:text-black px-6 capitalize py-2 text-sm font-semibold bg-sky-500 text-white rounded-full transition">
                            Find the best routes
                        </Link>
                    </div>
                </div>
            </section>

            {/* Local Routes Section */}
            <section className=" py-4 mb-4">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold capitalize mb-2">Local routes near Los Angeles</h2>
                    <p className="text-gray-600">Discover the best bike routes near Los Angeles with safety and fun in mind.</p>
                </div>
            </section>
        </>
    );
}
