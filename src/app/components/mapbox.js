'use client'
// components/MapboxDrawComponent.js
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';

mapboxgl.accessToken = 'pk.eyJ1Ijoibml0eWFob3lvcyIsImEiOiJjbGZ0N203ODQwNXBiM3FvbXhvd3UwcDcxIn0.auRwB9upsB10y6hEnczwAA';

const MapboxDrawComponent = () => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [draw, setDraw] = useState(null);
    const directionsClient = MapboxDirections({ accessToken: mapboxgl.accessToken });

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
                const data = draw.getAll();
                if (data.features.length > 0) {
                    const coordinates = data.features[0].geometry.coordinates;
                    if (coordinates.length >= 2) {
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
                const routes = [
                    {
                        waypoints: [
                            [-118.46648985815806, 33.979215019959895],
                            [-118.46346421565953, 33.98102090537734]
                        ]
                    },
                    {
                        waypoints: [
                            [-118.46451580173542, 33.978387564383326],
                            [-118.45548904936349, 33.96614642009822]
                        ]
                    }
                ];

                routes.forEach((route, index) => {
                    const waypoints = route.waypoints.map(coord => ({
                        coordinates: coord,
                    }));
                    console.log(`Route ${index + 1} waypoints:`, waypoints);
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
                                    'line-color': `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                                    'line-width': 5,
                                    'line-opacity': 0.75,
                                },
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

    }, [map]);

    return <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />;
};

export default MapboxDrawComponent;
