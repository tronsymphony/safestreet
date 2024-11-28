'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Fetch locations from the API
async function fetchLocations() {
  const res = await fetch('http://localhost:3000/api/locations');

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
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Locations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {locations.map((location) => (
          <div key={location.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <img
              src={location.image_url || '/default-image.png'} // Use a default image if none is provided
              alt={location.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{location.title}</h2>
              <p className="text-gray-500 mb-2">City: {location.city}</p>
              <p className="text-gray-500 mb-4">Added on: {new Date(location.created_at).toLocaleDateString()}</p>
              <div className="flex justify-between">
                <Link href={`/locations/${location.id}`} passHref className="text-white bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
                    View
                </Link>
                <Link href={`/locations/edit/${location.id}`} passHref className="text-slate-600 border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-lg transition">
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
