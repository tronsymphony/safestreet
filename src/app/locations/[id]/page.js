"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Modal from "@/app/components/Modal";
import Image from "next/image";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_GLMAP;

const SingleLocationComponent = ({ params }) => {

  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = params;

  // Fetch the location data by id
  const fetchPost = async (id) => {
    
    try {
      const response = await fetch(`/api/getlocationbyid?id=${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch location");
      }
      const data = await response.json();
      setLocationData(data);
    } catch (error) {
      console.error("Error fetching location:", error);
      setError("Could not load location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost(id);
  }, [id]);

  useEffect(() => {
    if (locationData && !map) {
      const { coordinates } = locationData;

      if (!coordinates || coordinates.length !== 2) {
        console.error("Invalid coordinates:", coordinates);
        return;
      }

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 14,
      });

      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${locationData.title}</h3><p>${locationData.city}</p>`
          )
        )
        .addTo(map);

      setMap(map);
    }
  }, [locationData, map]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/locations/${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Location URL copied to clipboard!");
  };

  const handleOpenModal = () => {
    const content = (
      <div className="p-4">
        <figure className="flex w-full">
          <Image
            width={200}
            height={200}
            className="object-cover h-auto w-full"
            src={locationData.featured_image || "/default-image.jpg"}
            alt={locationData.title}
          />
        </figure>
        <div className="p-8">
          <h2 className="text-2xl mb-4">{locationData.title}</h2>
          <p className="text-gray-700">{locationData.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>City:</strong> {locationData.city}
          </p>
        </div>
      </div>
    );
    setModalContent(content);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div>Loading location details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <section className="m-0 bg-slate-100">
        <div className="mx-auto">
          <div
            ref={mapContainerRef}
            className="rounded-md overflow-hidden"
            style={{ width: "100%", height: "60vh" }}
          />
        </div>
        <div className="mt-6 p-4">
          <h1 className="text-4xl font-bold">{locationData.title}</h1>
          <p className="text-gray-700 mt-2">{locationData.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>City:</strong> {locationData.city}
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              View Details
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Share Location
            </button>
          </div>
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

export default SingleLocationComponent;
