import Image from "next/image";
import styles from "./page.module.css";
import GMap from './components/map'
// const API_KEY = 'AIzaSyBSYN4U7NwpFWZfXmHCMF7jta6SHdMewVY';
export default function Home() {
  return (
    <main className={styles.main}>
      <GMap></GMap>
    </main>
  );
}
