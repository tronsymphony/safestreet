'use client'
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import Modal from './Modal';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_GLMAP;

const MapboxDrawComponent = () => {
    const router = useRouter();
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [draw, setDraw] = useState(null);
    const [routesData, setRoutesData] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userLocation, setUserLocation] = useState({ lat: 33.979215019959895, lng: -118.46648985815806 }); // Default location

    const directionsClient = useMemo(() => MapboxDirections({ accessToken: mapboxgl.accessToken }), []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/getroutes');
            const data = await response.json();
            setRoutesData(data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const parseCoordinates = (str) => {
        const matches = str.match(/\[.*\]/);
        if (matches && matches.length > 0) {
            return JSON.parse(matches[0]);
        }
        return [];
    };

    const parseCoordinatesID = (str) => {
        const firstNumber = str.match(/\((\d+)/)[1];

        if (firstNumber && firstNumber.length > 0) {
            return JSON.parse(firstNumber);
        }

        return [];
    };

    useEffect(() => {
        // Request user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error('Error fetching user location:', error);
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
                    style: 'mapbox://styles/mapbox/streets-v11',
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
                    defaultMode: 'draw_line_string',
                });

                // map.on('draw.create', updateRoute);
                // map.on('draw.update', updateRoute);
                // map.on('draw.delete', clearRoute);

                map.on('load', () => {
                    map.addSource('route', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: [],
                            },
                        },
                    });

                    map.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': '#3887be',
                            'line-width': 5,
                            'line-opacity': 0.75,
                        },
                    });

                });

                setMap(map);
                setDraw(draw);
            };

            initializeMap();
        }
    }, [map, directionsClient, userLocation]);

    // const updateRoute = (e) => {
    //     const data = draw.getAll();
    //     if (data.features.length > 0) {
    //         const coordinates = data.features[0].geometry.coordinates;
    //         if (coordinates.length >= 2) {
    //             console.log('Updated route coordinates:', coordinates);
    //             getRoute(coordinates);
    //         }
    //     }
    // };

    // const clearRoute = () => {
    //     if (map.getSource('route')) {
    //         map.getSource('route').setData({
    //             type: 'Feature',
    //             properties: {},
    //             geometry: {
    //                 type: 'LineString',
    //                 coordinates: [],
    //             },
    //         });
    //     }
    // };

    // const getRoute = (coordinates) => {
    //     const waypoints = coordinates.map(coord => ({ coordinates: coord }));
    //     directionsClient.getDirections({
    //         profile: 'driving',
    //         geometries: 'geojson',
    //         waypoints: waypoints,
    //     })
    //         .send()
    //         .then(response => {
    //             const route = response.body.routes[0].geometry;
    //             map.getSource('route').setData(route);
    //         })
    //         .catch(err => console.error('Error fetching directions:', err));
    // };

    const handleViewRoute = (routeId) => {
        router.push(`/posts/${routeId}`); // Navigate to /posts/[routeId]
        setIsModalOpen(false); // Close the modal after navigation
    };

    const loadMultipleRoutes = () => {

        routesData.routes?.forEach((route, index) => {
            const coordinates = (route.route);
            const routeIDParse = (route.id);
            const routeSlug = (route.slug);
            const waypoints = coordinates.map(coord => ({ coordinates: coord }));

            directionsClient.getDirections({
                profile: 'driving',
                geometries: 'geojson',
                waypoints: waypoints,
            })
                .send()
                .then(response => {
                    const route = response.body.routes[0].geometry;
                    const routeId = `route-${index}`;

                    map.addSource(routeId, {
                        type: 'geojson',
                        data: route,
                    });

                    map.addLayer({
                        id: routeId,
                        type: 'line',
                        source: routeId,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': `#444`,
                            'line-width': 5,
                            'line-opacity': 0.75,
                        },
                    });

                    map.on('click', routeId, (e) => {
                        const content = (
                            <div>
                                <h3>Route {route.title}</h3>
                                <button onClick={() => handleViewRoute(routeSlug)}>View Route</button>
                            </div>
                        );
                        setModalContent(content);
                        setIsModalOpen(true);
                    });

                    map.on('mouseenter', routeId, () => {
                        map.getCanvas().style.cursor = 'pointer';
                        map.setPaintProperty(routeId, 'line-color', '#ff0000');
                    });

                    map.on('mouseleave', routeId, () => {
                        map.getCanvas().style.cursor = '';
                        map.setPaintProperty(routeId, 'line-color', '#444');
                    });
                })
                .catch(err => console.error('Error fetching directions:', err));
        });
    };

    return (
        <>
            <section className="main-map">
                <div className="container">
                    <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />
                </div>
            </section>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={modalContent} />
        </>
    );
};

export default MapboxDrawComponent;
