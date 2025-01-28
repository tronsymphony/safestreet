'use client';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import Modal from './Modal';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_GLMAP;

const MapboxDrawComponent = () => {
    const mapContainerRef = useRef(null);
    const drawRef = useRef(null);
    const mapInstance = useRef(null);

    const [routesData, setRoutesData] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [featuredImageState, setFeaturedImageState] = useState('');
    const [routeCondition, setRouteCondition] = useState('');
    const [routeCity, setRouteCity] = useState('');
    const [drawnRoute, setDrawnRoute] = useState(null);
    const [userLocation, setUserLocation] = useState({
        lat: 33.979215019959895,
        lng: -118.46648985815806
    });

    const directionsClient = useMemo(
        () => MapboxDirections({ accessToken: mapboxgl.accessToken }),
        []
    );

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/getroutes');
            const data = await response.json();
            setRoutesData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleFeaturedImageStateChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFeaturedImageState(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error('Error fetching user location:', error);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (mapInstance.current && routesData.routes?.length > 0) {
            loadMultipleRoutes();
        }
    }, [routesData]);

    useEffect(() => {
        if (mapInstance.current && userLocation) {
            mapInstance.current.setCenter([userLocation.lng, userLocation.lat]);
        }
    }, [userLocation]);

    useEffect(() => {
        if (mapInstance.current || !mapContainerRef.current) return;
        initializeMap();
    }, [userLocation]);

    const initializeMap = () => {
        mapInstance.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [userLocation.lng, userLocation.lat],
            zoom: 13
        });

        drawRef.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                line_string: true,
                trash: true,
            },
            defaultMode: 'draw_line_string',
        });

        mapInstance.current.addControl(drawRef.current);

        const updateRoute = (e) => {
            const data = drawRef.current.getAll();
            if (data.features.length > 0) {
                const coordinates = data.features[0].geometry.coordinates;
                setDrawnRoute(coordinates);
                if (coordinates.length >= 2) {
                    getSnappedRoute(coordinates);
                }
            }
        };

        mapInstance.current.on('draw.create', updateRoute);
        mapInstance.current.on('draw.update', updateRoute);
        mapInstance.current.on('draw.delete', clearRoute);

        mapInstance.current.on('load', () => {
            mapInstance.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: []
                    }
                }
            });

            mapInstance.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        });
    };

    const clearRoute = () => {
        if (mapInstance.current.getSource('route')) {
            mapInstance.current.getSource('route').setData({
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: []
                }
            });
        }
        setDrawnRoute(null);
    };

    const getSnappedRoute = (coordinates) => {
        const waypoints = coordinates.map((coord) => ({ coordinates: coord }));
        directionsClient
            .getDirections({
                profile: 'cycling',
                geometries: 'geojson',
                waypoints: waypoints
            })
            .send()
            .then((response) => {
                const route = response.body.routes[0].geometry;
                if (mapInstance.current.getSource('route')) {
                    mapInstance.current.getSource('route').setData({
                        type: 'Feature',
                        properties: {},
                        geometry: route,
                    });
                }
            })
            .catch((err) => console.error('Error fetching directions:', err));
    };

    const saveRoute = async () => {
        if (!drawnRoute) {
            console.log("No route drawn to save.");
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

            if (!uploadRes.ok) {
                console.error('Failed to upload image:', await uploadRes.text());
                alert('Failed to upload the image.');
                return;
            }

            const uploadData = await uploadRes.json();
            featuredImage = uploadData.filePath;
        }

        try {
            const response = await fetch('/api/savecoordinates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    route: drawnRoute,
                    postTitle,
                    postContent,
                    featuredImage,
                    routeCondition,
                    routeCity,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Route saved successfully!');
            } else {
                console.log(`Failed to save route: ${data.error}`);
            }
        } catch (error) {
            console.error('Error saving route:', error);
        }
    };

    const deleteRoute = async () => {
        if (!selectedRouteId) return;

        try {
            const response = await fetch(`http://localhost:3000/api/deleteroute?id=${selectedRouteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setSelectedRouteId(null);
                fetchData();
            } else {
                console.log('Failed to delete the route');
            }
        } catch (error) {
            console.error('Error deleting route:', error);
        }
    };

    const loadMultipleRoutes = () => {
        routesData.routes?.forEach((route, index) => {
            const coordinates = route.route;
            const waypoints = coordinates.map((coord) => ({ coordinates: coord }));
            const routeID = route.id;

            directionsClient
                .getDirections({
                    profile: 'cycling',
                    geometries: 'geojson',
                    waypoints: waypoints
                })
                .send()
                .then((response) => {
                    const route = response.body.routes[0].geometry;
                    const routeId = `route-${index}`;

                    mapInstance.current.addSource(routeId, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: { id: routeID },
                            geometry: route,
                        }
                    });

                    mapInstance.current.addLayer({
                        id: routeId,
                        type: 'line',
                        source: routeId,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#444',
                            'line-width': 5,
                            'line-opacity': 0.75
                        }
                    });

                    mapInstance.current.on('click', routeId, (e) => {
                        setSelectedRouteId(routeID);
                    });

                    mapInstance.current.on('mouseenter', routeId, () => {
                        mapInstance.current.getCanvas().style.cursor = 'pointer';
                        mapInstance.current.setPaintProperty(routeId, 'line-color', '#ff0000');
                    });

                    mapInstance.current.on('mouseleave', routeId, () => {
                        mapInstance.current.getCanvas().style.cursor = '';
                        mapInstance.current.setPaintProperty(routeId, 'line-color', '#444');
                    });
                })
                .catch((err) => console.error('Error fetching directions:', err));
        });
    };

    return (
        <section className="p-5 bg-gray-50">
  {/* Map Container */}
  <div className="w-full h-[80vh] rounded-lg overflow-hidden shadow-md">
    <div ref={mapContainerRef} className="w-full h-full" />
  </div>

  {/* Delete Route Button (Conditional Rendering) */}
  {selectedRouteId && (
    <button
      onClick={deleteRoute}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      Delete Route {selectedRouteId}
    </button>
  )}

  {/* Form Container */}
  <div className="mt-6 max-w-2xl mx-auto space-y-4">
    {/* Featured Image Upload */}
    <div className="space-y-2">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-48 object-cover rounded-lg shadow-sm"
        />
      )}
      <label className="block text-sm font-medium text-gray-700">
        Featured Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFeaturedImageStateChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>

    {/* Route Condition Input */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Route Condition
      </label>
      <textarea
        value={routeCondition}
        onChange={(e) => setRouteCondition(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Describe the condition of the route..."
        rows={3}
      />
    </div>

    {/* Route City Input */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Route City
      </label>
      <textarea
        value={routeCity}
        onChange={(e) => setRouteCity(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter the city or area of the route..."
        rows={3}
      />
    </div>

    {/* Post Title Input */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Post Title
      </label>
      <input
        type="text"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter a title for your post..."
      />
    </div>

    {/* Route Description Input */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Route Description
      </label>
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Describe the route in detail..."
        rows={5}
      />
    </div>

    {/* Save Route Button */}
    <button
      onClick={saveRoute}
      className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Save Route
    </button>
  </div>

  {/* Modal Component */}
  <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    content={modalContent}
  />
</section>
    );
};

export default MapboxDrawComponent;