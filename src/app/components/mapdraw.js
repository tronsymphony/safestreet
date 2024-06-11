'use client';
import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, LoadScript, Polyline, DrawingManager, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import Modal from 'react-modal';
import { customMapStyles } from "./customMapStyles";

const libraries = ['drawing', 'places'];

export default function GMapDraw() {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBSYN4U7NwpFWZfXmHCMF7jta6SHdMewVY';
    const [drawnShapes, setDrawnShapes] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [mapLoaded, setMapLoaded] = useState(false);
    const [directionsResponses, setDirectionsResponses] = useState([]);
    const [waypoints, setWaypoints] = useState([]);
    const [directionsResponsesUpdate, setDirectionsResponsesUpdated] = useState(false);

    const mapOptions = {
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        styles: customMapStyles,
    };

    const onLoad = useCallback((map) => {
        setMapLoaded(true);
    }, []);

    const handlePolylineClick = (lat, lng) => {
        setModalContent({ lat, lng });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const updateWaypoints = (path) => {
        const updatedPath = path.getArray().map(coord => ({ lat: coord.lat(), lng: coord.lng() }));
        setWaypoints(updatedPath);
        setDirectionsResponsesUpdated(false); // Reset to allow new directions fetch
    };

    const onOverlayComplete = (e) => {
        const newShape = e.overlay;
        newShape.type = e.type;
        setDrawnShapes((prevShapes) => [...prevShapes, newShape]);


        if (newShape.type === 'polyline') {
            const path = newShape.getPath().getArray().map(coord => ({ lat: coord.lat(), lng: coord.lng() }));
            setWaypoints(path);
            console.log('New polyline created with path:', path);
        }
    };

    const clearMap = () => {
        drawnShapes.forEach(shape => shape.setMap(null)); // Remove all shapes from the map
        setDrawnShapes([]);
        setWaypoints([]);
        setDirectionsResponses([]);
        setDirectionsResponsesUpdated(false)
    };

    const directionsCallback = useCallback((result, status) => {
        if (status === 'OK' && result) {
            if (directionsResponsesUpdate == false) {
                console.log(directionsResponsesUpdate)
                setDirectionsResponses([result]);
                setDirectionsResponsesUpdated(true)

            }
        } else {
            console.error('error fetching directions', result, status);
        }
    }, [directionsResponsesUpdate]);




    return (
        <>
            <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
                <GoogleMap
                    center={{ lat: 33.979215019959895, lng: -118.46648985815806 }}
                    zoom={13}
                    mapContainerStyle={{ height: '80vh', width: '100%' }}
                    options={mapOptions}
                    onLoad={onLoad}
                >
                    {directionsResponses.map((directions, index) => (
                        <DirectionsRenderer
                            key={`directions-${index}`}
                            directions={directions}
                            options={{
                                polylineOptions: {
                                    strokeColor: '#FF5733',
                                    strokeOpacity: 0.7,
                                    strokeWeight: 1,
                                    editable: true,
                                },
                            }}
                        />
                    ))}

                    {mapLoaded && (
                        <DrawingManager
                            onOverlayComplete={onOverlayComplete}
                            options={{
                                drawingControl: true,
                                drawingControlOptions: {
                                    position: 1, // google.maps.ControlPosition.TOP_CENTER
                                    drawingModes: ['polyline'], // Only allow drawing polylines
                                },
                                polylineOptions: {
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 1.0,
                                    strokeWeight: 3,
                                    clickable: true,
                                    zIndex: 1,
                                    editable: true,
                                    draggable: true
                                },
                            }}
                        />
                    )}

                    {waypoints.length >= 2 && (
                        <DirectionsService
                            options={{
                                origin: waypoints[0],
                                destination: waypoints[waypoints.length - 1],
                                waypoints: waypoints.slice(1, waypoints.length - 1).map(location => ({ location })),
                                travelMode: 'TWO_WHEELER',
                                optimizeWaypoints: true,


                            }}
                            callback={directionsCallback}
                        />
                    )}
                </GoogleMap>
            </LoadScript>

            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Segment Info"
            >
                <h2 style={{ color: 'black' }}>Segment Info</h2>
                <pre style={{ color: 'black' }}>{JSON.stringify(modalContent, null, 2)}</pre>
                <button onClick={closeModal}>Close</button>
            </Modal>

            <button onClick={clearMap} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '10' }}>
                Clear Drawing
            </button>

        </>
    );
}
