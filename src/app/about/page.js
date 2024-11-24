import Head from "next/head";
import styles from "./page.module.scss";

export default function AboutPage() {
  return (
    <div>
      <Head>
        <title>About Us | Ride with GPS</title>
        <meta
          name="description"
          content="Learn more about Ride with GPS, our mission, and our passion for helping people explore the world on two wheels."
        />
        <meta name="keywords" content="about, Ride with GPS, biking, cycling, outdoor adventures" />
        <meta name="author" content="Ride with GPS" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className={styles.fold}>
          <div className="container mx-auto py-16 px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">About Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We empower people to reconnect with nature and embark on two-wheeled adventures, promoting a healthier and more connected lifestyle.
            </p>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className={styles.aboutsite}>
          <div className="container mx-auto py-16 px-4">
            <div className={styles.blockcontainer + " mb-16"}>
              <div className={styles.block + " text-gray-700"}>
                <h3 className="text-3xl font-bold mb-4">Who We Are</h3>
                <p className="text-lg leading-relaxed">
                  Ride with GPS was founded in 2007 by Zack and Cullen, two friends who shared a love for riding bikes, exploring new roads, and building innovative software. While we've grown significantly over the years, our core mission remains the same: to inspire people to get outdoors and ride, while providing the best service for our community.
                </p>
              </div>
              <figure className={styles.image + " mt-6"}>
                <img
                  src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Two cyclists enjoying a scenic ride"
                  className="rounded-lg shadow-lg"
                />
              </figure>
            </div>

            <div className={styles.blockcontainer + " mb-16"}>
              <figure className={styles.image + " mt-6"}>
                <img
                  src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Cyclist exploring new roads"
                  className="rounded-lg shadow-lg"
                />
              </figure>
              <div className={styles.block + " text-gray-700"}>
                <h3 className="text-3xl font-bold mb-4">Our Journey</h3>
                <p className="text-lg leading-relaxed">
                  Since 2007, Ride with GPS has been on a journey to revolutionize the way people explore the outdoors on two wheels. We provide tools that allow cyclists to plan, navigate, and share their adventures, empowering riders of all levels to take on new challenges.
                </p>
              </div>
            </div>

            <div className={styles.blockcontainer + " mb-16"}>
              <div className={styles.block + " text-gray-700"}>
                <h3 className="text-3xl font-bold mb-4">Our Commitment</h3>
                <p className="text-lg leading-relaxed">
                  At Ride with GPS, we are committed to continuous innovation and improvement. Our team is dedicated to providing a top-notch experience for our users by offering the best tools for planning routes, navigating on the go, and sharing stories from the road.
                </p>
              </div>
              <figure className={styles.image + " mt-6"}>
                <img
                  src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Riders planning their route with Ride with GPS"
                  className="rounded-lg shadow-lg"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className={styles.contantpress + " bg-gray-100 py-12"}>
          <div className="container mx-auto text-center">
            <p className="text-lg text-gray-700">
              For media or business inquiries, please contact us at <a href="mailto:nityahoyos@gmail.com" className="text-blue-600 hover:text-blue-800">nityahoyos@gmail.com</a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
