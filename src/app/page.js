import styles from "./page.module.scss";
import MapboxDrawComponent from "./components/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <MapboxDrawComponent></MapboxDrawComponent>
    </main>
  );
}
