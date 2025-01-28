import styles from "./page.module.css";
import MapboxDrawComponent from "../components/mapbox";

export default function Home() {
  return (
    <main className={`${styles.main} w-full bg-slate-100`}>
      {/* Header Section */}
      <header className="bg-slate-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">
            Explore Routes with Safe Streets Map
          </h1>
          <p className="text-gray-300 mt-2">
            Use our interactive map to find safe and reliable routes in your area.
          </p>
        </div>
      </header>

      {/* Map Section */}
      <section className="relative w-full p-4 bg-slate-900">
        <MapboxDrawComponent />
      </section>
    </main>
  );
}
