import Head from "next/head";

export default function AboutPage() {
  return (
    <div>
      <Head>
        <title>About Us | Safe Streets Map</title>
        <meta
          name="description"
          content="Discover Safe Streets Map—your personal guide to the safest biking and walking routes in town. Curated by experience, designed for urban explorers."
        />
        <meta
          name="keywords"
          content="Safe Streets Map, cycling safety, urban navigation, biking, pedestrian routes, local travel"
        />
        <meta name="author" content="Safe Streets Map" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-700 to-gray-500 text-white py-20 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl font-extrabold">Explore with Confidence</h1>
            <p className="text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
              Safe Streets Map is your personalized urban guide, designed to
              help cyclists and pedestrians find the safest, most enjoyable
              routes through the city.
            </p>
          </div>
        </section>

        {/* Why Safe Streets? */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Why Safe Streets?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mt-4">
              Finding the best way to move through a city shouldn&apos;t be a guessing game.
              Safe Streets Map offers curated, tested, and recommended routes that
              prioritize safety, efficiency, and comfort.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Feature 1 */}
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800">🚲 Safer Cycling Routes</h3>
                <p className="text-gray-600 mt-2">
                  Avoid dangerous intersections, congested streets, and find the best 
                  bike-friendly paths in town.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800">🛣️ Smart Navigation</h3>
                <p className="text-gray-600 mt-2">
                  Plan your journey with verified paths that minimize traffic and maximize 
                  safety and enjoyment.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800">🌿 Scenic & Enjoyable</h3>
                <p className="text-gray-600 mt-2">
                  Ride or walk through the most scenic and comfortable urban routes—because 
                  safety should be enjoyable too.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-200">
          <div className="container mx-auto px-6 lg:px-12">
           

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
              <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
              How It Works
            </h2>
                <p className="text-gray-700 leading-relaxed">
                  Safe Streets Map is built on years of personal experience and real-world
                  testing. Every route is carefully evaluated based on:
                </p>
                <ul className="list-disc pl-6 mt-4 text-gray-700">
                  <li>✅ Low Traffic Exposure – Avoids heavy car congestion</li>
                  <li>✅ Dedicated Bike & Pedestrian Paths – Prioritizes safety</li>
                  <li>✅ Neighborhood Safety Ratings – Routes reviewed for security</li>
                  <li>✅ Enjoyability & Scenery – Focused on comfort and experience</li>
                </ul>
              </div>
              <img
                src="https://images.pexels.com/photos/7242703/pexels-photo-7242703.jpeg"
                alt="Cyclist exploring a recommended route"
                className="rounded-md shadow-lg max-h-96 w-full object-cover "
              />
            </div>
          </div>
        </section>

        {/* Get Involved */}
        <section className="py-16 bg-gray-900 text-white text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
            <p className="text-lg max-w-2xl mx-auto mb-6">
              Safe Streets Map is constantly evolving. Do you have a favorite
              safe route? Want to help improve city navigation? Let&apos;s work
              together to make urban travel safer for everyone.
            </p>
            <a
              href="mailto:nityahoyos@gmail.com"
              className="inline-block px-8 py-3 bg-sky-500 rounded-full font-semibold text-white hover:bg-sky-600 transition duration-300"
            >
              Contact Me
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
