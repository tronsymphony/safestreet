'use client'
// components/MapboxDrawComponent.js
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';

mapboxgl.accessToken = 'pk.eyJ1Ijoibml0eWFob3lvcyIsImEiOiJjbGZ0N203ODQwNXBiM3FvbXhvd3UwcDcxIn0.auRwB9upsB10y6hEnczwAA';

const MapboxDrawComponent = () => {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null); // To store map instance without triggering re-renders
    const [draw, setDraw] = useState(null);
    const [routesData, setRoutesData] = useState([]);
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

    useEffect(() => {
        if (mapInstance.current) return; // If map instance exists, do nothing

        if (mapContainerRef.current) {
            mapInstance.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-118.46648985815806, 33.979215019959895],
                zoom: 13,
            });

            const drawControl = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    line_string: true,
                    point: true,
                    trash: true,
                },
                defaultMode: 'draw_line_string',
            });

            mapInstance.current.addControl(drawControl);
            setDraw(drawControl);
        }
    }, []); // Empty array ensures this useEffect runs only once

    return <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />;
};

export default MapboxDrawComponent;
