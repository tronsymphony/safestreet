'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Fetch locations from the API
async function fetchLocations() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${API_URL}/api/locations`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch locations');
  }

  const locations = await res.json();
  return locations;
}

export default function LocationListPage() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const locationsData = await fetchLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    getLocations();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Locations</h1>
        <p className="text-gray-500 mt-2">Browse and manage your listed locations.</p>
      </header>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Location Image */}
            <img
              src={location.image_url || '/default-image.png'} // Use a default image if none is provided
              alt={location.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {location.title}
              </h2>
              <p className="text-gray-500 text-sm mb-1">
                <span className="font-medium">City:</span> {location.city}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                <span className="font-medium">Added on:</span> {new Date(location.created_at).toLocaleDateString()}
              </p>
              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Link
                  href={`/locations/${location.id}`}
                  passHref
                  className="inline-block bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
                >
                  View
                </Link>
                <Link
                  href={`/locations/edit/${location.id}`}
                  passHref
                  className="inline-block text-sky-500 border border-sky-500 px-4 py-2 rounded-lg hover:bg-sky-500 hover:text-white transition"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
