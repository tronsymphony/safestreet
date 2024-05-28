'use client';
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, Polyline } from '@react-google-maps/api';
import Modal from 'react-modal';


export default function GMap() {
    const API_KEY = 'AIzaSyBSYN4U7NwpFWZfXmHCMF7jta6SHdMewVY';
    const [directionsResponses, setDirectionsResponses] = useState([]);
    const [directionsResponsesUpdate, setDirectionsResponsesUpdated] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [mapLoaded, setMapLoaded] = useState(false);

    const routes = [
        {
            origin: { lat: 33.96153532016564, lng: -118.4580683665798 },
            destination: { lat: 34.02697494372404, lng: -118.37695068714318 },
            waypoints: [{ location: { lat: 33.96153532016564, lng: -118.4580683665798 } }]
        },
        {
            origin: { lat: 33.97539397145512, lng: -118.4325378031858 },
            destination: { lat: 33.96431555913657, lng: -118.4230538223665 },
            waypoints: [{ location: { lat: 33.97539397145512, lng: -118.4325378031858 } }]
        },
        {
            origin: { lat: 33.979215019959895, lng: -118.46648985815806 },
            destination: { lat: 33.99046011410423, lng: -118.4477936067906 },
            waypoints: [{ location: { lat: 33.979215019959895, lng: -118.46648985815806 } }]
        }
    ];

    const directionsCallback = useCallback((result, status) => {
        if (directionsResponsesUpdate == false) {
            if (status === 'OK' && result) {
                setDirectionsResponses((prevResponses) => [...prevResponses, result]);
            } else {
                console.error('error fetching directions', result, status);
            }
            setDirectionsResponsesUpdated(true)
        }

    }, [directionsResponsesUpdate]);

    const mapOptions = {
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
    };

    const onLoad = useCallback(() => {
        setMapLoaded(true);
    }, []);

    const handlePolylineClick = (lat, lng) => {
        setModalContent({ lat, lng });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };



    return (
        <>
            <LoadScript googleMapsApiKey={API_KEY}>
                <GoogleMap
                    center={{ lat: 33.979215019959895, lng: -118.46648985815806 }}
                    zoom={13}
                    mapContainerStyle={{ height: '80vh', width: '100%' }}
                    options={mapOptions}
                    onLoad={onLoad}
                >
                    {routes.map((route, index) => (
                        <React.Fragment key={index}>

                            <DirectionsService
                                options={{
                                    destination: route.destination,
                                    origin: route.origin,
                                    waypoints: route.waypoints,
                                    travelMode: 'BICYCLING',
                                }}
                                callback={directionsCallback}
                            />
                        </React.Fragment>
                    ))}
                    {directionsResponses.map((directions, index) => (
                        <React.Fragment key={index}>
                            {directions.routes[0].legs.map((leg, legIndex) =>
                                leg.steps.map((step, stepIndex) => (
                                    <Polyline
                                        key={stepIndex}
                                        path={step.path}
                                        options={{
                                            strokeColor: index % 2 === 0 ? '#FF0000' : '#0000FF',
                                            strokeOpacity: 0.8,
                                            strokeWeight: 4,
                                        }}
                                        onClick={(e) => handlePolylineClick(e.latLng.lat(), e.latLng.lng())}
                                    />
                                ))
                            )}
                        </React.Fragment>
                    ))}
                </GoogleMap>
            </LoadScript>

            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Segment Info"
            >
                <h2 style={{ color: 'black' }}>Segment Info</h2>
                <p style={{ color: 'black' }}>Latitude: {modalContent.lat}</p>
                <p style={{ color: 'black' }}>Longitude: {modalContent.lng}</p>
                <button onClick={closeModal}>Close</button>
            </Modal>

            {/* <div>Distance: {distance} meters</div> */}
            {/* <div>Duration: {duration} seconds</div> */}
        </>
    );
}
