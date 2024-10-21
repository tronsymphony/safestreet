'use client';
import React, { useState, useEffect, useCallback } from "react";
import styles from "../page.module.scss";
import Image from "next/image"
export default function HomePageHero() {
    return (
        <>
            <section className={styles.pagehero}>
                <Image
                    width="900"
                    height="600"
                    alt=""
                    src="https://images.pexels.com/photos/172484/pexels-photo-172484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                ></Image>
                <div className={styles.container}>

                    <h2 className="">Discover City Routes</h2>
                    <p>A Curated List of Roads That are recommended routes for getting aound the city.</p>
                    <button className="hover:bg-black hover:text-white px-6 py-2 text-sm bg-green-500 text-black rounded-full">Find the best routes</button>
                </div>
            </section>
            <section className={styles.pageright}>
                <div className="container">
                    <div className={styles.header}>
                        <h2 className="text-3xl">
                            We want you to have more fun on your bike. <br/> Ride in new places, and let us take care of the detail.
                        </h2>
                    </div>
                    <div className={`${styles.pagerighttricolumns} max-w-6xl`}>
                        <div className={styles.pagerighttricolumn}>
                            <h3 className="text-xl font-semibold mb-2">Find the Safest Route</h3>
                            <p>Explore the safest routes through the city with our advanced mapping tools. Whether you're biking, walking, or driving, our app helps you avoid high-traffic areas and dangerous intersections.</p>
                        </div>
                        <div className={styles.pagerighttricolumn}>
                            <h3 className="text-xl font-semibold mb-2">Plan Your Journey</h3>
                            <p>Customize your route to prioritize safety. Use our planner to avoid busy roads, find well-lit streets, and choose paths that are best suited for your journey, no matter the time of day.</p>
                        </div>
                        <div className={styles.pagerighttricolumn}>
                            <h3 className="text-xl font-semibold mb-2">Navigate with Confidence</h3>
                            <p>Set off on your route knowing you&apos;ve chosen the safest path. Our app provides real-time updates on your route, helping you adjust on the go to stay on the safest track.</p>
                        </div>
                    </div>
                    <div className={styles.pagerightbtn}>
                        <button className="hover:bg-black hover:text-white px-6 py-2 text-sm bg-green-500 text-black rounded-full px-4">Find the best routes</button>
                    </div>
                </div>
            </section>
            <section className="pagelocals">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl text-center capitalize">Local routes near Los Angeles</h2>
                </div>
            </section>
        </>
    );
}
