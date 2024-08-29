import styles from "./page.module.css";
import MapboxDrawComponent from "../components/mapbox";

export default function Home() {
  return (
    <main className={styles.main}>
      <MapboxDrawComponent />
    </main>
  );
}
