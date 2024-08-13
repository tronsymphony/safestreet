'use client'
import styles from "./page.module.css";
import SignUp from "../components/SignUp";
export default function Home() {
  return (
    <main className={styles.main}>
        <SignUp></SignUp>
    </main>
  );
}
