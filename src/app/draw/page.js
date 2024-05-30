import styles from "../page.module.css";
import GMapDraw from '../components/mapdraw'
export default function Home() {
  return (
    <main className={styles.main}>
      <GMapDraw></GMapDraw>
    </main>
  );
}
