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
    const drawRef = useRef(null); // Use useRef to store draw control
    const [routesData, setRoutesData] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [postTitle, setPostTitle] = useState(''); // State to manage post title
    const [postContent, setPostContent] = useState('');
    const [userLocation, setUserLocation] = useState({
        lat: 33.979215019959895,
        lng: -118.46648985815806
    }); // Default location
    const [drawnRoute, setDrawnRoute] = useState(null);
    const mapInstance = useRef(null); // To store map instance without triggering re-renders
    const directionsClient = useMemo(
        () => MapboxDirections({ accessToken: mapboxgl.accessToken }),
        []
    );
    const [featuredImage, setFeaturedImage] = useState('');
    const [routeCondition, setRouteCondition] = useState('');
    const [routeCity, setRouteCity] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/getroutes');
            const data = await response.json();
            setRoutesData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Handle featured image file upload
    const handleFeaturedImageChange = (e) => {
        setFeaturedImage(e.target.files[0]);
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
        if (mapInstance.current && routesData.routes && routesData.routes.length > 0) {
            loadMultipleRoutes();
        }
    }, [routesData]);

    useEffect(() => {
        if (mapInstance.current && userLocation) {
            mapInstance.current.setCenter([userLocation.lng, userLocation.lat]);
        }
    }, [userLocation]);

    useEffect(() => {
        if (mapInstance.current) return;

        if (mapContainerRef.current) {
            initializeMap();
        }

    }, [userLocation]);

    const initializeMap = () => {

        mapInstance.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [userLocation.lng, userLocation.lat],
            zoom: 13
        });

        // Initialize MapboxDraw and store it in the ref
        drawRef.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                line_string: true,
                trash: true,
            },
            defaultMode: 'draw_line_string', // Mode for drawing line strings
        });

        // Set the draw control in the map instance
        mapInstance.current.addControl(drawRef.current);

        // Update route by snapping it to streets using the Mapbox Directions API
        const updateRoute = (e) => {
            const data = drawRef.current.getAll();
            if (data.features.length > 0) {
                const coordinates = data.features[0].geometry.coordinates;
                setDrawnRoute(coordinates); // Save the drawn route

                // Convert the coordinates to waypoints for the Directions API
                if (coordinates.length >= 2) {
                    getSnappedRoute(coordinates);
                }
            }
        };

        // Listen to draw.create and draw.update events to allow route drawing and editing
        mapInstance.current.on('draw.create', updateRoute);
        mapInstance.current.on('draw.update', updateRoute);
        mapInstance.current.on('draw.delete', clearRoute);

        // When the map is loaded, set up the route source and layer
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

    // Function to get the snapped route from the Directions API
    const getSnappedRoute = (coordinates) => {
        const waypoints = coordinates.map((coord) => ({ coordinates: coord }));

        // Get route snapped to streets
        directionsClient
            .getDirections({
                profile: 'cycling', // Use cycling profile for biking routes
                geometries: 'geojson',
                waypoints: waypoints
            })
            .send()
            .then((response) => {
                const route = response.body.routes[0].geometry;

                // Update the route source with the snapped route
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

    // Save the drawn route to the API
    const saveRoute = async () => {
        if (!drawnRoute) {
            console.log("No route drawn to save.");
            return;
        }

        let imageUrl = '';

        if (featuredImage) {
            const formData = new FormData();
            formData.append('file', featuredImage);

            const uploadRes = await fetch('/api/uploadImage', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (uploadRes.ok) {
                imageUrl = uploadData.filePath;
            } else {
                return;
            }
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
                    imageUrl,
                    routeCondition,
                    routeCity,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Route saved successfully!');
            } else {
                console.log(`Failed to save route: ${data.error}`);
            }
        } catch (error) {
            console.error('Error saving route:', error);
            console.log('An error occurred while saving the route.');
        }
    };

    // Handle route deletion by ID
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
                // console.log('Route deleted successfully!');
                setSelectedRouteId(null); // Clear the selected route ID after deletion
                fetchData(); // Refresh the route list after deletion
            } else {
                console.log('Failed to delete the route');
            }
        } catch (error) {
            console.error('Error deleting route:', error);
            console.log('An error occurred while deleting the route.');
        }
    };

    const loadMultipleRoutes = () => {
        routesData.routes?.forEach((route, index) => {
            const coordinates = (route.route);
            const waypoints = coordinates.map((coord) => ({ coordinates: coord }));
            const routeID = (route.id);

            directionsClient
                .getDirections({
                    profile: 'cycling', // Use cycling profile for RideWithGPS-style routes
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
                        // const routeId = e.features[0].properties.id;
                        setSelectedRouteId(routeID); // Set the selected route ID
                        // console.log(`Route ${routeID} selected`);
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
        <>
            <section className="main-map">
                <div className="container">
                    <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />
                </div>

                {selectedRouteId && (
                    <button onClick={deleteRoute}>
                        Delete Route {selectedRouteId}
                    </button>
                )}

                <div style={{ marginTop: '20px' }}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Featured Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFeaturedImageChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <label>
                        Route Condition:
                        <textarea
                            value={routeCondition}
                            onChange={(e) => setRouteCondition(e.target.value)}
                            style={{ display: 'block', width: '300px', height: '100px', marginTop: '10px', padding: '5px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Route City:
                        <textarea
                            value={routeCity}
                            onChange={(e) => setRouteCity(e.target.value)}
                            style={{ display: 'block', width: '300px', height: '100px', marginTop: '10px', padding: '5px' }}
                        />
                    </label>

                    <label>
                        Post Title:
                        <input
                            type="text"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
                        />
                    </label>
                    <br />
                    <label style={{ marginTop: '10px' }}>
                        Route Description:
                        <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            style={{ display: 'block', width: '300px', height: '100px', marginTop: '10px', padding: '5px' }}
                        />
                    </label>

                    <button onClick={saveRoute} style={{ marginTop: '10px' }}>
                        Save Route
                    </button>

                </div>
            </section>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={modalContent} />
        </>
    );
};

export default MapboxDrawComponent;
