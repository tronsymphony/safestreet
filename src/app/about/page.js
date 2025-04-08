import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <Head>
        <title>About Us | Safe Streets Map</title>
        <meta
          name="description"
          content="Safe Streets Map provides cyclists and pedestrians with carefully curated routes prioritizing safety, efficiency, and enjoyment across urban environments."
        />
        <meta
          name="keywords"
          content="Safe Streets Map, cycling safety, urban navigation, biking, pedestrian routes, safe commuting, bicycle paths, walking trails"
        />
        <meta name="author" content="Safe Streets Map" />
      </Head>

      <main>
        {/* Hero Section - Improved with better contrast and call-to-action */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
                          <Image
              src="https://images.pexels.com/photos/6039184/pexels-photo-6039184.jpeg"
              alt="Urban cycling map background"
              fill
              className="object-cover brightness-[0.30]"
              priority
            />
          </div>
          <div className="container relative z-10 mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
              Navigate <span className="text-sky-400">Safely</span>, Explore <span className="text-sky-400">Confidently</span>
            </h1>
            <div className="w-24 h-1 bg-sky-500 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mt-4 leading-relaxed font-light text-gray-100">
              Safe Streets Map is your personalized urban guide, designed to
              help cyclists and pedestrians find the safest, most enjoyable
              routes through the city.
            </p>
            <div className="mt-10">
              <Link
                href="/map"
                className="inline-block px-8 py-4 bg-sky-500 text-white rounded-md font-medium hover:bg-sky-600 transition duration-300 shadow-lg"
              >
                Explore Routes Now
              </Link>
            </div>
          </div>
        </section>

        {/* Our Story Section - New */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
                  Our Story
                </h2>
                <div className="w-16 h-1 bg-sky-500 mb-8"></div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Safe Streets Map began with a simple question: &quot;How can urban travelers find the safest routes?&quot;
                  After experiencing numerous close calls while cycling through the city, our founder began
                  meticulously documenting and rating routes based on safety, comfort, and efficiency.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  What started as a personal project has evolved into a comprehensive
                  resource trusted by thousands of cyclists and pedestrians looking to navigate
                  urban environments safely.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Every route in our database has been personally traveled, evaluated, and rated to ensure
                  you can explore with complete confidence.
                </p>
              </div>
              <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/1840792/pexels-photo-1840792.jpeg"
                  alt="Safe Streets Map founder cycling"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 max-w-4xl">
            <blockquote className="text-center italic text-xl md:text-2xl text-gray-700 font-light leading-relaxed">
            &quot;I believe everyone deserves to explore their city without compromising safety. 
              Safe Streets Map was born from countless hours of personal exploration, creating 
              a resource I wish I had when I first started cycling in the city.&quot;
            </blockquote>
            <div className="flex justify-center mt-8">
              <div className="flex items-center">
                <div className="h-px w-12 bg-sky-500 mr-4"></div>
                <p className="text-gray-600 font-medium">Jamie Chen, Founder</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Safe Streets? */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl text-gray-800 font-light mb-4">Why Safe Streets?</h2>
              <div className="w-16 h-1 bg-sky-500 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto font-light text-lg">
                Finding the best way to move through a city shouldn&apos;t be a guessing game.
                Safe Streets Map offers curated, tested, and recommended routes that
                prioritize safety, efficiency, and comfort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg transition-transform hover:transform hover:scale-105">
                <div className="text-sky-500 text-4xl mb-4">🚲</div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Safer Cycling Routes</h3>
                <p className="text-gray-600">
                  Avoid dangerous intersections, congested streets, and find the best 
                  bike-friendly paths in town, all vetted through real experience.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg transition-transform hover:transform hover:scale-105">
                <div className="text-sky-500 text-4xl mb-4">🛣️</div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Smart Navigation</h3>
                <p className="text-gray-600">
                  Plan your journey with verified paths that minimize traffic exposure and maximize 
                  safety. Each route is carefully rated and described.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg transition-transform hover:transform hover:scale-105">
                <div className="text-sky-500 text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Scenic & Enjoyable</h3>
                <p className="text-gray-600">
                  Ride or walk through the most scenic and comfortable urban routes—because 
                  safety should never come at the expense of enjoyment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
                  How Safe Streets Works
                </h2>
                <div className="w-16 h-1 bg-sky-500 mb-8"></div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Safe Streets Map is built on years of personal experience and real-world
                  testing. Every route is carefully evaluated based on multiple factors
                  to ensure you have the best possible journey.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-sky-100 p-2 rounded-full text-sky-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Low Traffic Exposure</h3>
                      <p className="text-gray-600">Routes are selected to minimize interaction with heavy vehicle traffic</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sky-100 p-2 rounded-full text-sky-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Dedicated Paths</h3>
                      <p className="text-gray-600">Priority given to dedicated bike lanes, pedestrian paths, and greenways</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sky-100 p-2 rounded-full text-sky-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Safety Ratings</h3>
                      <p className="text-gray-600">Each route includes detailed safety ratings and neighborhood information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sky-100 p-2 rounded-full text-sky-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Enjoyability Factor</h3>
                      <p className="text-gray-600">Routes are evaluated for their scenic value and overall enjoyment</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 relative h-96 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/7242703/pexels-photo-7242703.jpeg"
                  alt="Cyclist exploring a recommended route"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Enhanced */}
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-12 text-center">
              What Our Community Says
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-slate-700 p-8 rounded-lg">
                <svg className="w-10 h-10 text-sky-400 mb-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
                </svg>
                <blockquote className="text-lg md:text-xl text-white font-light italic leading-relaxed mb-6">
                &quot;Safe Streets Map changed how I commute. I discovered routes I never knew existed, 
                  cutting my travel time while actually enjoying my ride. It&quot;s become my go-to 
                  resource for getting around the city.&quot;
                </blockquote>
                <p className="text-sky-400 font-medium">— Alex, Daily Commuter</p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-slate-700 p-8 rounded-lg">
                <svg className="w-10 h-10 text-sky-400 mb-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
                </svg>
                <blockquote className="text-lg md:text-xl text-white font-light italic leading-relaxed mb-6">
                &quot;As a parent, I was nervous about letting my kids bike to school. The Safe Streets Map
                  helped us find a route that avoids major intersections and stays on protected bike lanes.
                  Now we all ride together with peace of mind.&quot;
                </blockquote>
                <p className="text-sky-400 font-medium">— Maya, Parent & Weekend Cyclist</p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved - Enhanced with statistics */}
        <section className="py-20 bg-gradient-to-r from-sky-600 to-sky-800 text-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-light mb-6">Join Our Growing Community</h2>
                <div className="w-16 h-1 bg-white mb-8"></div>
                <p className="text-lg max-w-2xl mb-10 font-light">
                  Safe Streets Map is constantly evolving. Do you have a favorite
                  safe route? Want to help improve city navigation? Let&apos;s work
                  together to make urban travel safer for everyone.
                </p>
                
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">500+</div>
                    <p className="text-sky-200">Verified Routes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">2,000+</div>
                    <p className="text-sky-200">Active Users</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">15+</div>
                    <p className="text-sky-200">City Districts</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">100%</div>
                    <p className="text-sky-200">Safety Focused</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    className="inline-block px-8 py-4 bg-white text-sky-700 rounded-md font-medium hover:bg-gray-100 transition duration-300 shadow-lg"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/contribute"
                    className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-md font-medium hover:bg-white/10 transition duration-300"
                  >
                    Suggest a Route
                  </Link>
                </div>
              </div>
              
              <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/5428263/pexels-photo-5428263.jpeg"
                  alt="Community members planning safe routes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter - New Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl font-light text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Get the latest updates on new routes, safety tips, and community events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button className="px-6 py-3 bg-sky-500 text-white rounded-md font-medium hover:bg-sky-600 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}