import styles from "../page.module.css";
import MapboxDrawComponent from "../../components/mapbox-draw-state";

export default function Home() {
  return (
    <main className={styles.main}>
      <MapboxDrawComponent />
    </main>
  );
}
