'use client';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Modal from '@/app/components/Modal';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_GLMAP;

const LocationMapComponent = () => {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const [locationsData, setLocationsData] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [marker, setMarker] = useState(null); // Store a single marker
    const [locationDetails, setLocationDetails] = useState({
        title: '',
        description: '',
        city: '',
        coordinates: null,
    });
    const [featuredImageState, setFeaturedImageState] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // State for search input

    // Fetch existing locations
    const fetchData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/api/getlocations`);
            const data = await response.json();
            setLocationsData(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    // Handle featured image file upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFeaturedImageState(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    useEffect(() => {
        if (mapInstance.current) return;

        mapInstance.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-118.46648985815806, 33.979215019959895],
            zoom: 13,
        });

        // Add map click listener
        mapInstance.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;

            // If a marker already exists, remove it
            if (marker) marker.remove();

            // Create a new marker
            const newMarker = new mapboxgl.Marker({ draggable: true })
                .setLngLat([lng, lat])
                .addTo(mapInstance.current);

            setMarker(newMarker);

            // Store the coordinates
            setLocationDetails((prev) => ({
                ...prev,
                coordinates: [lng, lat],
            }));
        });

        fetchData();
    }, []);

    // Save the location to the database
    const saveLocation = async () => {
        if (!locationDetails.coordinates) {
            alert('Please select a location on the map.');
            return;
        }

        let featuredImage = '';
        if (featuredImageState) {
            const formData = new FormData();
            formData.append('file', featuredImageState);

            const uploadRes = await fetch('/api/uploadimgeroute', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (uploadRes.ok) {
                featuredImage = uploadData.filePath;
            } else {
                alert('Failed to upload the image.');
                return;
            }
        }

        try {
            const response = await fetch('/api/savelocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...locationDetails, featuredImage }),
            });

            if (response.ok) {
                alert('Location saved successfully!');
                setLocationDetails({ title: '', description: '', city: '' });
                setPreviewUrl('');
                setMarker(null);
                fetchData(); // Refresh location data
            } else {
                alert('Failed to save location.');
            }
        } catch (error) {
            console.error('Error saving location:', error);
            alert('An error occurred while saving the location.');
        }
    };

    // Search for an address and place a marker
    const searchAddress = async () => {
        if (!searchQuery.trim()) {
            alert('Please enter an address to search.');
            return;
        }

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    searchQuery
                )}.json?access_token=${mapboxgl.accessToken}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }

            const data = await response.json();
            const [lng, lat] = data.features[0].center;

            // Move map to the searched location
            mapInstance.current.flyTo({ center: [lng, lat], zoom: 15 });

            // If a marker already exists, remove it
            if (marker) marker.remove();

            // Create a new marker
            const newMarker = new mapboxgl.Marker({ draggable: true })
                .setLngLat([lng, lat])
                .addTo(mapInstance.current);

            setMarker(newMarker);

            // Update location details with new coordinates
            setLocationDetails((prev) => ({
                ...prev,
                coordinates: [lng, lat],
            }));
        } catch (error) {
            console.error('Error searching for address:', error);
            alert('An error occurred while searching for the address.');
        }
    };

    // Render multiple locations on the map
    useEffect(() => {
        if (!mapInstance.current || !locationsData.length) return;

        locationsData.forEach((location) => {
            const { coordinates, title, id } = location;

            const locMarker = new mapboxgl.Marker()
                .setLngLat(coordinates)
                .setPopup(new mapboxgl.Popup().setText(title))
                .addTo(mapInstance.current);

            locMarker.getElement().addEventListener('click', () => {
                setSelectedLocationId(id);
                setModalContent(location);
                setIsModalOpen(true);
            });
        });
    }, [locationsData]);

    return (
        <>
            <section className="main-map">
                <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }}></div>

                <div style={{ marginTop: '20px' }}>
                    <div>
                        {previewUrl && <img src={previewUrl} alt="Preview" />}
                        <label>Featured Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>

                    <label>Search Address</label>
                    <div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter an address"
                            style={{ marginRight: '10px' }}
                        />
                        <button onClick={searchAddress}>Search</button>
                    </div>

                    <label>Title</label>
                    <input
                        type="text"
                        value={locationDetails.title}
                        onChange={(e) => setLocationDetails({ ...locationDetails, title: e.target.value })}
                    />

                    <label>Description</label>
                    <textarea
                        value={locationDetails.description}
                        onChange={(e) => setLocationDetails({ ...locationDetails, description: e.target.value })}
                    ></textarea>

                    <label>City</label>
                    <input
                        type="text"
                        value={locationDetails.city}
                        onChange={(e) => setLocationDetails({ ...locationDetails, city: e.target.value })}
                    />

                    <button onClick={saveLocation}>Save Location</button>
                </div>
            </section>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={modalContent} />
        </>
    );
};

export default LocationMapComponent;
