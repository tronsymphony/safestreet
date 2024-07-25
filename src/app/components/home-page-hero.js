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
                <h2 className={styles.title}>Discover Safe  City Routes</h2>
                <p>A Curated List of Roads That are recommended routes for getting aound the city.</p>
                <button className="goto">Find the best routes</button>
            </div>
        </section>
        <section className={styles.pageright}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        We want you to have more fun on your bike. Ride in new places, and let us take care of the detail.
                        </h2>
                </div>
                <div className={styles.pagerighttricolumns}>
                    <div className={styles.pagerighttricolumn}>
                        <h3 className={styles.title}>Build the perfect route</h3>
                        <p>Find a great route, and tweak it with our planner. It&apos;s easy to find the best routes wherever you are, and our tools let you adjust difficulty and start location.</p>
                    </div>
                    <div className={styles.pagerighttricolumn}>
                        <h3 className={styles.title}>Build the perfect route</h3>
                        <p>Find a great route, and tweak it with our planner. It&apos;s easy to find the best routes wherever you are, and our tools let you adjust difficulty and start location.</p>
                    </div>
                    <div className={styles.pagerighttricolumn}>
                        <h3 className={styles.title}>Build the perfect route</h3>
                        <p>Find a great route, and tweak it with our planner. It&apos;s easy to find the best routes wherever you are, and our tools let you adjust difficulty and start location.</p>
                    </div>
                </div>
                <div className={styles.pagerightbtn}>
                <button className="goto">Find the best routes</button>
                </div>
            </div>
        </section>
        <section className="pagelocals">
            <div className="container">
                <h2 className="title">Local routes near Los Angeles</h2>
            </div>
        </section>

        
        </>
    );
}
