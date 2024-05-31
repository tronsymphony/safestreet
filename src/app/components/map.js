'use client';
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, Polyline, BicyclingLayer } from '@react-google-maps/api';
import Modal from 'react-modal';
import { customMapStyles } from "./customMapStyles"

export default function GMap() {
    const API_KEY = 'AIzaSyBSYN4U7NwpFWZfXmHCMF7jta6SHdMewVY';
    const [directionsResponses, setDirectionsResponses] = useState([]);
    const [directionsResponsesUpdate, setDirectionsResponsesUpdated] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [mapLoaded, setMapLoaded] = useState(false);
    const [clickedLatLng, setClickedLatLng] = useState(null);

    const routes = [
        {
            origin: { lat: 33.96153532016564, lng: -118.4580683665798 },
            destination: { lat: 34.02697494372404, lng: -118.37695068714318 },
            waypoints: [{ location: { lat: 33.96153532016564, lng: -118.4580683665798 } }],
            color: '#FF5733'
        },
        {
            origin: { lat: 33.97539397145512, lng: -118.4325378031858 },
            destination: { lat: 33.96431555913657, lng: -118.4230538223665 },
            waypoints: [{ location: { lat: 33.97539397145512, lng: -118.4325378031858 } }],
            color: 'darkgreen'
        },
        {
            origin: { lat: 33.979215019959895, lng: -118.46648985815806 },
            destination: { lat: 33.99046011410423, lng: -118.4477936067906 },
            waypoints: [{ location: { lat: 33.979215019959895, lng: -118.46648985815806 } }],
            color: 'darkgreen'
        }
    ];

    // const directionsCallback = useCallback((result, status) => {
    //     if (directionsResponsesUpdate == false) {
    //         if (status === 'OK' && result) {
    //             setDirectionsResponses((prevResponses) => [...prevResponses, result]);
    //         } else {
    //             console.error('error fetching directions', result, status);
    //         }
    //         setDirectionsResponsesUpdated(true)
    //     }

    // }, [directionsResponsesUpdate]);

    const mapOptions = {
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        // mapTypeId: 'terrain' 
        styles: customMapStyles,
    };

    const onLoad = useCallback((map) => {
        setMapLoaded(true);
        // const bikeLayer = new window.google.maps.BicyclingLayer();
        // bikeLayer.setMap(map);
    }, []);

    const handlePolylineClick = (lat, lng) => {
        setModalContent({ lat, lng });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setClickedLatLng({ lat, lng });
        setModalContent({ lat, lng });
        setModalIsOpen(true);
    };


    const transformWaypointsToRoutes = (waypoints, color = 'darkgreen') => {
        if (waypoints.length < 2) {
            console.error("Not enough waypoints to form a route.");
            return [];
        }

        const routes = [];
        for (let i = 0; i < waypoints.length - 1; i++) {
            const route = {
                origin: {
                    lat: waypoints[i].lat,
                    lng: waypoints[i].lng
                },
                destination: {
                    lat: waypoints[i + 1].lat,
                    lng: waypoints[i + 1].lng
                },
                waypoints: waypoints.slice(i + 1, i + 2).map(coord => ({
                    location: { lat: coord.lat, lng: coord.lng }
                })),
            };
            routes.push(route);
        }
        return routes;
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getroutes', {
                method: 'GET',
            });


            const data = await response.json();

            setDirectionsResponses(data.routes || []);
            // console.log(data.routes)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>

            {/* {Array.isArray(directionsResponses) && directionsResponses.length > 0 ? (
                <div>
                    {directionsResponses.map((route, index) => (
                        <pre key={index}>{JSON.stringify(route, null, 2)}</pre>
                    ))}
                </div>
            ) : (
                <p>No routes available</p>
            )} */}

            <LoadScript googleMapsApiKey={API_KEY}>
                <GoogleMap
                    center={{ lat: 33.979215019959895, lng: -118.46648985815806 }}
                    zoom={10}
                    mapContainerStyle={{ height: '80vh', width: '100%' }}
                    options={mapOptions}
                    onLoad={onLoad}
                >


                    {/* {directionsResponses.map((route, index) => {
                        if (route.routes.length < 2) {
                            return null; // Skip if there are less than two points
                        }

                        const waypoints = route.routes.slice(1, -1).map(point => ({
                            location: { lat: point.lat, lng: point.lng },
                            stopover: true,
                        }));
                        const origin = { lat: route.routes[0].lat, lng: route.routes[0].lng };
                        const destination = { lat: route.routes[route.routes.length - 1].lat, lng: route.routes[route.routes.length - 1].lng };

                        const options = {
                            destination: destination,
                            origin: origin,
                            waypoints: waypoints,
                            travelMode: 'BICYCLING',
                        };

                        return (
                            <React.Fragment key={index}>
                                {options && options.origin && options.destination && (
                                    <DirectionsService
                                        options={options}
                                        callback={directionsCallback}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })} */}


                    {directionsResponses.map((routeResponse, index) => {
                        const route = routeResponse.routes; // Assuming you want the first route

                        const options = transformWaypointsToRoutes(route)

                        console.log(options)

                        return (
                            <React.Fragment key={index}>
                                {options[0] && options[0].origin && options[0].destination && (
                                    <DirectionsService
                                        options={options[0]}
                                        // callback={directionsCallback}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}




                    {/* {directionsResponses.map((result, index) => (
                        <DirectionsRenderer
                            key={index}
                            directions={result}
                            options={{
                                polylineOptions: {
                                    strokeColor: '#FF5733',
                                    strokeOpacity: 0.7,
                                    strokeWeight: 2,
                                    editable: false,
                                },
                            }}
                        />
                    ))} */}


                    {/* {directionsResponses.map((route, index) => (
                        <React.Fragment key={index}>
                            <Polyline
                                path={route.routes.map(point => ({ lat: point.lat, lng: point.lng }))}
                                options={{
                                    strokeColor: '#FF0000', // Shadow color (use a fixed color or add color to your route data)
                                    strokeOpacity: 0.2, // Shadow opacity
                                    strokeWeight: 5, // Shadow weight (larger than main line)
                                }}
                                onClick={(e) => handlePolylineClick(e.latLng.lat(), e.latLng.lng())}
                            />

                            <Polyline
                                path={route.routes.map(point => ({ lat: point.lat, lng: point.lng }))}
                                options={{
                                    strokeColor: '#FF0000', // Main color (use a fixed color or add color to your route data)
                                    strokeOpacity: 0.7,
                                    strokeWeight: 2,
                                }}
                                onClick={(e) => handlePolylineClick(e.latLng.lat(), e.latLng.lng())}
                            />
                        </React.Fragment>
                    ))} */}



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
                <p style={{ color: 'black' }}>{modalContent.lat}, {modalContent.lng}</p>
                <button onClick={closeModal}>Close</button>
            </Modal>

            {/* <div>Distance: {distance} meters</div> */}
            {/* <div>Duration: {duration} seconds</div> */}
        </>
    );
}
