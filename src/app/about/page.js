import Head from "next/head";

export default function AboutPage() {
  return (
    <div>
      <Head>
        <title>About Us | Safe Streets Map</title>
        <meta
          name="description"
          content="Learn more about Safe Streets Map, our mission to make urban travel safer, and our passion for creating smarter and more enjoyable routes for cyclists and pedestrians."
        />
        <meta
          name="keywords"
          content="Safe Streets Map, cycling safety, urban routes, biking, route planning, pedestrian safety"
        />
        <meta name="author" content="Safe Streets Map" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-500 to-slate-400 text-white py-14 text-center">
          <div className="container mx-auto">
            <h1 className="text-5xl font-extrabold mb-4">About Us</h1>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              At Safe Streets Map, we are passionate about creating safer streets
              and empowering cyclists and pedestrians to explore their cities with
              confidence.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 lg:px-12">
            {/* Who We Are */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Who We Are
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Safe Streets Map was created by advocates for safer urban
                  mobility. Our mission is to help people navigate cities safely
                  by providing thoughtfully rated routes for cyclists and
                  pedestrians, combining innovation with local expertise.
                </p>
              </div>
              <img
                src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Cyclists enjoying a safe urban ride"
                className="rounded-md shadow-lg"
              />
            </div>

            {/* Our Journey */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <img
                src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Cyclist exploring a carefully planned route"
                className="rounded-md shadow-lg"
              />
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Our Journey
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Since its inception, Safe Streets Map has been revolutionizing
                  how people move through urban spaces. We provide tools that
                  prioritize safety, allowing riders and walkers to avoid
                  high-traffic areas and discover safer, smarter routes.
                </p>
              </div>
            </div>

            {/* Our Commitment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Our Commitment
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We are dedicated to innovation and community. By offering
                  advanced tools for route planning, real-time navigation, and
                  user feedback, we ensure safer streets for everyone—one
                  journey at a time.
                </p>
              </div>
              <img
                src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Riders reviewing their next route on Safe Streets Map"
                className="rounded-md shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-900 text-white py-12">
          <div className="container mx-auto text-center">
            <p className="text-lg mb-4">
              Have questions or business inquiries? Reach out to us at{" "}
              <a
                href="mailto:nityahoyos@gmail.com"
                className="text-sky-400 underline hover:text-sky-500"
              >
                nityahoyos@gmail.com
              </a>
              .
            </p>
            <button className="px-8 py-3 bg-sky-500 rounded-full font-semibold text-white hover:bg-sky-600 transition duration-300">
              Contact Us
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
