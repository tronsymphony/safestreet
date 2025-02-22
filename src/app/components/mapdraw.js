'use client'
// components/MapboxDrawComponent.js
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import Modal from './Modal';

mapboxgl.accessToken = 'pk.eyJ1Ijoibml0eWFob3lvcyIsImEiOiJjbTZvbGdnZmwwZmE0Mm1vdTliZm1wdWRyIn0.9IJO1-WXoAolKYQV5VLTOw';

const MapboxDrawComponent = () => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [draw, setDraw] = useState(null);
    const [routesData, setRoutesData] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const directionsClient = MapboxDirections({ accessToken: mapboxgl.accessToken });

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getroutes', {
                method: 'GET',
            });
            const data = await response.json();
            setRoutesData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const parseCoordinates = (str) => {
        const matches = str.match(/\[.*\]/);
        if (matches && matches.length > 0) {
            const coordinatesArray = JSON.parse(matches[0]);
            return coordinatesArray;
        }
        return [];
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-118.46648985815806, 33.979215019959895],
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

            map.addControl(draw);
            setDraw(draw);

            map.on('draw.create', updateRoute);
            map.on('draw.update', updateRoute);
            map.on('draw.delete', clearRoute);

            function updateRoute(e) {
                if (!draw) return; 
                const data = draw.getAll();
                if (data.features.length > 0) {
                    const coordinates = data.features[0].geometry.coordinates;
                    if (coordinates.length >= 2) {
                        console.log('Updated route coordinates:', coordinates);
                        getRoute(coordinates);
                    }
                }
            }

            function clearRoute() {
                if (map.getSource('route')) {
                    map.getSource('route').setData({
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: [],
                        },
                    });
                }
            }

            function getRoute(coordinates) {
                const waypoints = coordinates.map(coord => ({
                    coordinates: coord,
                }));

                directionsClient.getDirections({
                    profile: 'driving',
                    geometries: 'geojson',
                    waypoints: waypoints,
                })
                    .send()
                    .then(response => {
                        const route = response.body.routes[0].geometry;
                        map.getSource('route').setData(route);
                    })
                    .catch(err => {
                        console.error('Error fetching directions:', err);
                    });
            }

            function loadMultipleRoutes() {
                console.log(routesData);
                routesData.routes?.forEach((route, index) => {
                    const coordinates = parseCoordinates(route.routes);
                    const waypoints = coordinates.map(coord => ({
                        coordinates: coord,
                    }));

                    directionsClient.getDirections({
                        profile: 'driving',
                        geometries: 'geojson',
                        waypoints: waypoints,
                    })
                        .send()
                        .then(response => {
                            const route = response.body.routes[0].geometry;
                            const routeId = `route-${index}`;

                            if (map.getLayer(routeId)) {
                                map.removeLayer(routeId);
                            }
                            if (map.getSource(routeId)) {
                                map.removeSource(routeId);
                            }

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
                                const clickedCoordinates = e.features[0].geometry.coordinates;
                                const content = (
                                    <div>
                                        <h3>Route {index + 1}</h3>
                                        <p>Coordinates: {JSON.stringify(clickedCoordinates)}</p>
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
                        .catch(err => {
                            console.error('Error fetching directions:', err);
                        });
                });
            }

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

                setMap(map);
                loadMultipleRoutes();
            });
        };

        if (!map) initializeMap({ setMap, mapContainer: mapContainerRef });

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [map, routesData]);

    return (
        <>
            <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={modalContent} />
        </>
    );
};

export default MapboxDrawComponent;
