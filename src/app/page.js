import styles from "./page.module.css";
import GMap from './components/map'
export default function Home() {
  return (
    <main className={styles.main}>
      <GMap></GMap>
    </main>
  );
}
