'use client';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import Modal from './Modal';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_GLMAP;

const MapboxDrawComponent = ({ post }) => {
    const mapContainerRef = useRef(null);
    const drawRef = useRef(null); // Use useRef to store draw control
    const [routesData, setRoutesData] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
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
    const { route_id } = post;

    const fetchData = async (route_id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/getroute?id=${route_id}`);
            const data = await response.json();
            setRoutesData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
        fetchData(route_id);
    }, []);

    useEffect(() => {
        if (mapInstance.current && routesData.route && routesData.route.length > 0) {
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


    const loadMultipleRoutes = () => {
        routesData.route?.forEach((route, index) => {
            const coordinates = route.route

            const waypoints = coordinates.map((coord) => ({ coordinates: coord }));
            const routeID = route.id;

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
                        const content = (
                            <div>
                                <h3>Route {index + 1}</h3>
                            </div>
                        );
                        setModalContent(content);
                        setIsModalOpen(true);
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
            <section className="">
                <div className="">
                    <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />
                </div>
            </section>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={modalContent} />
        </>
    );
};

export default MapboxDrawComponent;
