'use client'
import styles from "./page.module.css";
import Login from "../components/Login";
export default function Home() {
  return (
    <main className={styles.main}>
        <Login></Login>
    </main>
  );
}
