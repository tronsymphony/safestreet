"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_GLMAP;

const EditLocationComponent = ({ params }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({
    title: "",
    description: "",
    city: "",
    featured_image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const { id } = params;

  // Fetch the location data by ID
  const fetchLocation = async (id) => {
    try {
      const response = await fetch(`/api/getlocationbyid?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch location");
      }
      const data = await response.json();
      setLocationData(data);
      setUpdatedDetails({
        title: data.title,
        description: data.description,
        city: data.city,
        featured_image: data.featured_image,
      });
    } catch (error) {
      console.error("Error fetching location:", error);
      setError("Could not load location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation(id);
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
        .addTo(map);

      setMap(map);
    }
  }, [locationData, map]);

  const handleUpdateLocation = async () => {
    try {
      const isFile = updatedDetails.featured_image instanceof File;
      let featuredImagePath = locationData.featured_image; // Default to existing image URL
  
      // If it's a new file, upload it first
      if (isFile) {
        const formData = new FormData();
        formData.append("file", updatedDetails.featured_image);
  
        const uploadResponse = await fetch("/api/uploadimgeroute", {
          method: "POST",
          body: formData,
        });
  
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }
  
        const uploadData = await uploadResponse.json();
        featuredImagePath = uploadData.filePath; // Use the new uploaded image path
      }
  
      // Prepare updated location data
      const updatedData = {
        id,
        title: updatedDetails.title || locationData.title,
        description: updatedDetails.description || locationData.description,
        city: updatedDetails.city || locationData.city,
        coordinates: locationData.coordinates, // Ensure coordinates are passed correctly
        featured_image: featuredImagePath, // Use the updated or existing image path
      };
  
      const response = await fetch(`/api/updatelocation?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update location");
      }
  
      alert("Location updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating location:", error);
      alert("An error occurred while updating the location.");
    }
  };
  


  const handleDeleteLocation = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this location? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/deletelocation?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete location");
      }

      alert("Location deleted successfully!");
      window.location.href = "/locations"; // Redirect to locations list
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("An error occurred while deleting the location.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUpdatedDetails((prev) => ({
      ...prev,
      featured_image: file,
    }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  if (loading) {
    return <div>Loading location details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <section className="m-0 bg-slate-100">
        <div className="mx-auto">
          <div
            ref={mapContainerRef}
            className="rounded-md overflow-hidden"
            style={{ width: "100%", height: "60vh" }}
          />
        </div>
        <div className="mt-6 p-4">
          <h1 className="text-4xl font-bold">Edit Location</h1>
          <div className="mt-4">
            <label className="block mb-2 font-semibold">Title</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={updatedDetails.title}
              onChange={(e) =>
                setUpdatedDetails((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              className="border rounded w-full p-2"
              value={updatedDetails.description}
              onChange={(e) =>
                setUpdatedDetails((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            ></textarea>
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-semibold">City</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={updatedDetails.city}
              onChange={(e) =>
                setUpdatedDetails((prev) => ({ ...prev, city: e.target.value }))
              }
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-semibold">Featured Image</label>
            {previewUrl || updatedDetails.featured_image ? (
              <Image
                width={200}
                height={200}
                className="rounded"
                src={
                  previewUrl ||
                  updatedDetails.featured_image ||
                  "/default-image.jpg"
                }
                alt="Preview"
              />
            ) : null}
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={handleImageChange}
            />
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleUpdateLocation}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Update Location
            </button>
            <button
              onClick={handleDeleteLocation}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Location
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditLocationComponent;
