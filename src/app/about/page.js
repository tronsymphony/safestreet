// app/about/page.js
import Head from "next/head";
import styles from "./page.module.scss";
export default function AboutPage() {
  return (
    <div>
      <main>
        <section className={styles.fold}>
          <div className="container">
            <h1>About Us</h1>
            <p>
              We empower people to get outside, reconnect with nature, and
              embark on two-wheeled adventures.
            </p>
          </div>
        </section>
        <section className={styles.aboutsite}>
          <div className="container">
            <div className={styles.blockcontainer}>
              <div className={styles.block}>
                <h3 className={styles.title}>
                    Who We Are
                    </h3>
                <p>
                  Ride with GPS was founded in 2007 by Zack and Cullen, two
                  friends with a shared love of riding bikes, exploring new
                  roads, and writing cool software. We've grown and changed
                  quite a bit since the early days, but the important things
                  remain unchanged: Our passion for bikes, our mission to
                  inspire you to get out and ride, and our commitment to
                  building the very best service for our community.
                </p>
              </div>
              <figure className={styles.image}>
                <img
                  src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="bike"
                />
              </figure>
            </div>
            <div className={styles.blockcontainer}>
              <figure className={styles.image}>
                <img
                  src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="bike"
                />
              </figure>
              <div className={styles.block}>
                <h3 className={styles.title}>
                    Who We Are</h3>
                <p>
                  Ride with GPS was founded in 2007 by Zack and Cullen, two
                  friends with a shared love of riding bikes, exploring new
                  roads, and writing cool software. We've grown and changed
                  quite a bit since the early days, but the important things
                  remain unchanged: Our passion for bikes, our mission to
                  inspire you to get out and ride, and our commitment to
                  building the very best service for our community.
                </p>
              </div>
            </div>
            <div className={styles.blockcontainer}>
              <div className={styles.block}>
                <h3 className={styles.title}>
                    Who We Are</h3>
                <p>
                  Ride with GPS was founded in 2007 by Zack and Cullen, two
                  friends with a shared love of riding bikes, exploring new
                  roads, and writing cool software. We've grown and changed
                  quite a bit since the early days, but the important things
                  remain unchanged: Our passion for bikes, our mission to
                  inspire you to get out and ride, and our commitment to
                  building the very best service for our community.
                </p>
              </div>
              <figure className={styles.image}>
                <img
                  src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="bike"
                />
              </figure>
            </div>
          </div>
        </section>
        <section className={styles.contantpress}>
            <div className="container">
                <p>For Inquiries, please contact nityahoyos@gmail.com</p>
            </div>
        </section>
      </main>
    </div>
  );
}
