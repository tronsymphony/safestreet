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

const MapboxDrawComponent = () => {
  const token = cookies.get("token");
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);
  const [routesData, setRoutesData] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [userLocation, setUserLocation] = useState({
    lat: 33.979215019959895,
    lng: -118.46648985815806,
  });

  const directionsClient = useMemo(
    () => MapboxDirections({ accessToken: mapboxgl.accessToken }),
    []
  );

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/getroutes");
      const data = await response.json();
      setRoutesData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const postRouteLike = async (routeId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/routes/${routeId}/like`,
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
    fetchData();
  }, []);

  useEffect(() => {
    if (map && routesData.routes && routesData.routes.length > 0) {
      loadMultipleRoutes();
    }
  }, [map, routesData]);

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

        // map.on('draw.create', updateRoute);
        // map.on('draw.update', updateRoute);
        // map.on('draw.delete', clearRoute);

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

  const handleRouteLike = (routeId) => {
    postRouteLike(routeId);
  };

  const loadMultipleRoutes = () => {
    routesData.routes?.forEach((route, index) => {
      const coordinates = route.route;
      const routeSlug = route.slug;
      const routeTitle = route.title;
      const featured_image = route.featured_image;
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
          const routeLegs = response.body.routes[0].legs;

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

          console.log(featured_image);

          map.on("click", routeId, (e) => {
            const content = (
              <div className="flex- flex-col">
                <figure className="flex w-full">
                  <Image
                    width={200}
                    height={300}
                    className="object-cover h-auto w-full max-h-52"
                    src={featured_image? featured_image :  "https://images.pexels.com/photos/3006223/pexels-photo-3006223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                    alt={routeTitle}
                  />
                </figure>
                <div className="p-8 flex flex-col items-start justify-center">
                  <h2 className="text-2xl mb-4">{routeTitle}</h2>
                  <div className="mb-4">
                    A route on Venice BLVD. There are potholes but it is mostly
                    fine.
                  </div>
                  <div className="flex text-sm">
                    <b>Distance</b>: {(distance * 0.000621371).toFixed(2)} mi
                  </div>
                  <div className="flex text-sm">
                    <b>Condition</b>: Bumpy
                  </div>
                  <div className="flex text-sm">
                    <b>Location</b>: Los Angeles, CA
                  </div>
                  <ul className="py-4 text-sm">
                    {routeLegs.map((leg, index) => (
                      <li key={index}>
                        <b>Steps</b>: {index + 1} {leg.summary}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
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
                    <button
                      className="text-sm px-4 py-2 bg-green-500 text-white rounded-full hover:bg-gray-800"
                      onClick={() => handleRouteLike(index)}
                      disabled={hasLiked}
                    >
                      
                      <HandThumbUpIcon className="size-4"></HandThumbUpIcon>
                    </button>
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
      <section className="m-0  bg-slate-100">
        <div className="mx-auto">
          <div
            ref={mapContainerRef}
            className="rounded-md overflow-hidden"
            style={{ width: "100%", height: "60vh" }}
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
