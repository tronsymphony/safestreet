import styles from "./page.module.css";
import MapboxDrawComponent from "../components/mapbox";

export default function Home() {
  return (
    <main className={`${styles.main} w-full bg-slate-100`}>
      <section className="relative w-full p-4 bg-slate-900">
        <MapboxDrawComponent />
      </section>
    </main>
  );
}
