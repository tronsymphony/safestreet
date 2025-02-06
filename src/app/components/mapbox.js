"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import Modal from "./Modal";
import cookies from "js-cookie";
import Image from "next/image";
import {
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  ShareIcon,
  MapIcon,
} from "@heroicons/react/24/solid";


mapboxgl.accessToken = process.env.NEXT_PUBLIC_GLMAP;

async function toggleLike(routeId, isLiked, userId) {
  const res = await fetch(`/api/toggleLike`, {
    method: isLiked ? "DELETE" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ route_id: routeId, user_id: userId }),
  });

  if (!res.ok) {
    throw new Error("Failed to toggle like");
  }
  return res.json();
}

const MapboxDrawComponent = ({ session }) => {
  const token = cookies.get("token");
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);
  const [routesData, setRoutesData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [userLocation, setUserLocation] = useState();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const directionsClient = useMemo(
    () => MapboxDirections({ accessToken: mapboxgl.accessToken }),
    []
  );

  useEffect(() => {
    // Fetch routes and locations
    const fetchData = async () => {
      try {
        const [routesRes, locationsRes] = await Promise.all([
          fetch(`${API_URL}/api/getroutes`),
          fetch(`${API_URL}/api/locations`),
        ]);

        const routes = await routesRes.json();
        const locations = await locationsRes.json();

        setRoutesData(routes);
        setLocationsData(locations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const postRouteLike = async (routeId) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${API_URL}/api/routes/${routeId}/like`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("You have already liked this route");
        } else {
          throw new Error("Failed to like the route");
        }
      }

      const data = await response.json();
      setLikeCount((prevCount) => prevCount + 1); // Increment like count
      setHasLiked(true); // Update like state
    } catch (error) {
      console.error("Error liking the route:", error.message);
    }
  };

  useEffect(() => {
    // Request user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error fetching user location:", error);
        // Use default location if the user denies access or there's an error
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (map) {
      if (routesData.routes?.length > 0) {
        loadMultipleRoutes();
      }

      if (locationsData.length > 0) {
        loadLocations();
      }
    }
  }, [map, routesData, locationsData]);

  useEffect(() => {
    if (map && userLocation) {
      map.setCenter([userLocation.lng, userLocation.lat]);
    }
  }, [userLocation, map]);

  useEffect(() => {
    if (userLocation && !map) {
      const initializeMap = () => {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [userLocation.lng, userLocation.lat],
          zoom: 13,
        });



        // Create a marker and add it to the map
        const userMarker = new mapboxgl.Marker()
          .setLngLat([userLocation.lng, userLocation.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
            <div class="bg-white p-4 max-w-xs">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Your Location</h3>
              <p class="text-sm text-gray-600 mb-4">
                Latitude: ${userLocation.lat.toFixed(4)}<br>
                Longitude: ${userLocation.lng.toFixed(4)}
              </p>
              <button
                id="zoom-to-location"
                class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Zoom In
              </button>
            </div>
          `)
          )
          .addTo(map);

        // Add event listener to the button
        userMarker.getPopup()
          .on('open', () => {
            document.getElementById('zoom-to-location').addEventListener('click', () => {
              map.flyTo({
                center: [userLocation.lng, userLocation.lat],
                zoom: 15,
              });
            });
          });

        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            line_string: true,
            point: true,
            trash: true,
          },
          defaultMode: "draw_line_string",
        });

        map.on("load", () => {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [],
              },
            },
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3887be",
              "line-width": 5,
              "line-opacity": 0.75,
            },
          });
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
            showUserLocation: true,
          }),
          "top-right"
        );

        map.addControl(new mapboxgl.FullscreenControl(), "top-right");
        map.addControl(new mapboxgl.ScaleControl(), "bottom-left");

        setMap(map);
        setDraw(draw);
      };

      initializeMap();
    }
  }, [map, directionsClient, userLocation]);

  const handleViewRoute = (routeId) => {
    router.push(`/posts/${routeId}`); // Navigate to /posts/[routeId]
    setIsModalOpen(false); // Close the modal after navigation
  };

  const handleViewLocoation = (routeId) => {
    router.push(`/locations/${routeId}`); // Navigate to /posts/[routeId]
    setIsModalOpen(false); // Close the modal after navigation
  };

  const handleLikeToggle = async (index) => {
    if (!session) {
      alert("You must be logged in to like this post.");
      return;
    }

    try {
      const updatedData = await toggleLike(index, isLiked, session.id);
      setLikeCount(updatedData.like_count);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle like.");
    }
  };

  const loadLocations = () => {
    locationsData.forEach((location) => {
      const { coordinates, title, description, image_url, slug } = location;

      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        setModalContent(
          <div className="flex- flex-col">
            <figure className="flex w-full">
              <Image
                width={200}
                height={300}
                className="object-cover h-auto w-full max-h-52"
                src={
                  image_url
                    ? image_url
                    : "https://images.pexels.com/photos/3006223/pexels-photo-3006223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                }
                alt={title}
              />
            </figure>
            <div className="p-4 flex flex-col items-start justify-center">
              <h2 className="text-2xl mb-4">{title}</h2>
              <div className="mb-4">{description}</div>
              <div className="flex gap-2">
                <button
                  className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                  onClick={() => handleViewLocoation(slug)}
                >
                  View Location
                </button>
                <button
                  className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                  onClick={() => handleViewLocoation(slug)}
                >
                  <ChatBubbleLeftIcon className="size-4"></ChatBubbleLeftIcon>
                </button>
                <button
                  className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                  onClick={() => handleLikeToggle(routeId)}
                  disabled={hasLiked}
                >
                  <HandThumbUpIcon className="size-4"></HandThumbUpIcon>
                </button>
                <button
                  className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                  onClick={() => handleViewLocoation(slug)}
                >
                  <ShareIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>
        );
        setIsModalOpen(true);
      });
    });
  };

  const loadMultipleRoutes = () => {
    routesData.routes?.forEach((route, index) => {
      const coordinates = route.route;
      const routeSlug = route.slug;
      const routeTitle = route.title;
      const featured_image = route?.featured_image;
      const waypoints = coordinates.map((coord) => ({ coordinates: coord }));

      directionsClient
        .getDirections({
          profile: "driving",
          geometries: "geojson",
          waypoints: waypoints,
        })
        .send()
        .then((response) => {
          const route = response.body.routes[0].geometry;
          const distance = response.body.routes[0].distance;
          const routeId = `route-${index}`;
          const routeName = response.body.routes[0].legs[0].summary;

          map.addSource(routeId, {
            type: "geojson",
            data: route,
          });

          map.addLayer({
            id: routeId,
            type: "line",
            source: routeId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": `#444`,
              "line-width": 5,
              "line-opacity": 0.75,
            },
          });

          map.on("click", routeId, (e) => {
            const content = (
              <div className="flex- flex-col">
                <figure className="flex w-full">
                  <Image
                    width={200}
                    height={300}
                    className="object-cover h-auto w-full max-h-52"
                    src={
                      featured_image
                        ? featured_image
                        : "https://images.pexels.com/photos/3006223/pexels-photo-3006223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    }
                    alt={routeTitle}
                  />
                </figure>
                <div className="p-4 flex flex-col items-start justify-center">
                  <h2 className="text-2xl mb-4">{routeTitle}</h2>
                  <div className="mb-4">
                    A route on Venice BLVD. There are potholes but it is mostlyc
                    fine.
                  </div>
                  {/* <div className="flex text-sm">
                    <b>Distance</b>: {(distance * 0.000621371).toFixed(2)} mi
                  </div> */}
                  {/* <div className="flex text-sm">
                    <b>Condition</b>: Bumpy
                  </div> */}
                  {/* <div className="flex text-sm">
                    <b>Location</b>: {routeName}
                  </div> */}

                  <div className="flex gap-2 mt-4">
                    <button
                      className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                      onClick={() => handleViewRoute(routeSlug)}
                    >
                      View Route
                    </button>
                    <button
                      className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                      onClick={() => handleViewRoute(routeSlug)}
                    >
                      <ChatBubbleLeftIcon className="size-4"></ChatBubbleLeftIcon>
                    </button>
                    {/* <button
                      className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                      onClick={() => handleLikeToggle(routeId)}
                      disabled={hasLiked}
                    >
                      <HandThumbUpIcon className="size-4"></HandThumbUpIcon>
                      {isLiked ? "Unlike" : "Like"} ({likeCount})
                    </button> */}
                    <button
                      className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                      onClick={() => handleViewRoute(routeSlug)}
                    >
                      <ShareIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );

            setModalContent(content);
            setIsModalOpen(true);
          });

          map.on("mouseenter", routeId, () => {
            map.getCanvas().style.cursor = "pointer";
            map.setPaintProperty(routeId, "line-color", "#ff0000");
          });

          map.on("mouseleave", routeId, () => {
            map.getCanvas().style.cursor = "";
            map.setPaintProperty(routeId, "line-color", "#444");
          });
        })
        .catch((err) => console.error("Error fetching directions:", err));
    });
  };

  return (
    <>
      <section className="py-14 mb-4 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-light capitalize mb-2">
            Safest Bike Routes Near Los Angeles
          </h2>
          <p className="text-gray-200 font-light">
            Discover my personally rated bike routes around Los Angeles, carefully chosen for their safety and enjoyable riding experience.
          </p>
        </div>
      </section>
      <section className="m-0  bg-slate-100">
        <div className="mx-auto">
          <div
            ref={mapContainerRef}
            className="rounded-lg overflow-hidden "
            style={{ width: "100%", height: "80vh" }}
          />
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modalContent}
      />
    </>
  );
};

export default MapboxDrawComponent;
