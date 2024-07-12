import React, { useEffect, useState } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { Box, Link, VStack, Text, Button, Flex, Heading } from "@chakra-ui/react";

// RestaurantList 컴포넌트
function RestaurantList({ restaurants, onRestaurantClick }) {
    return (
        <VStack align="stretch" spacing={2} overflowY="auto" height="400px">
            {restaurants.map((restaurant, index) => (
                <Box
                    key={index}
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => onRestaurantClick(restaurant)}
                >
                    <Text fontWeight="bold">{restaurant.place.place_name}</Text>
                    <Text fontSize="sm">{restaurant.place.road_address_name || restaurant.place.address_name}</Text>
                </Box>
            ))}
        </VStack>
    );
}

export default function MapView() {
    const apiKey = import.meta.env.VITE_API_KEY;
    const [map, setMap] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [foodMarkers, setFoodMarkers] = useState([]);
    const [cafeMarkers, setCafeMarkers] = useState([]);
    const [info, setInfo] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(37.5662952, 126.9779451), // Seoul
                    level: 3,
                };
                const newMap = new window.kakao.maps.Map(mapContainer, options);
                setMap(newMap);
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (map && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setCurrentPosition({ latitude, longitude });
                    map.panTo(new window.kakao.maps.LatLng(latitude, longitude));
                    searchNearbyPlaces(latitude, longitude);
                },
                (error) => console.error("Error getting current location:", error)
            );
        }
    }, [map]);

    const searchNearbyPlaces = (latitude, longitude) => {
        if (!window.kakao || !window.kakao.maps) return;

        const ps = new window.kakao.maps.services.Places();
        const categories = ["FD6", "CE7"];

        categories.forEach((categoryCode) => {
            let placesAccumulator = [];

            const searchPlaces = (pagination) => {
                ps.categorySearch(
                    categoryCode,
                    (data, status, pagination) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            placesAccumulator = placesAccumulator.concat(data);
                            if (pagination.hasNextPage) {
                                pagination.nextPage();
                            } else {
                                displayPlacesOnMap(placesAccumulator, categoryCode);
                            }
                        } else {
                            console.error("Failed to fetch places:", status);
                        }
                    },
                    { location: new window.kakao.maps.LatLng(latitude, longitude) }
                );
            };

            searchPlaces();
        });
    };

    const displayPlacesOnMap = (places, categoryCode) => {
        const markersArray = places.map((place) => ({
            position: { lat: place.y, lng: place.x },
            content: place.place_name,
            place: place,
        }));

        if (categoryCode === "FD6") {
            setFoodMarkers(markersArray);
        } else if (categoryCode === "CE7") {
            setCafeMarkers(markersArray);
        }
    };

    const handleShowFoodMarkers = () => {
        setInfo(null);
        setSelectedRestaurant(null);
        setFoodMarkers((prev) => prev.map((marker) => ({ ...marker, visible: true })));
        setCafeMarkers((prev) => prev.map((marker) => ({ ...marker, visible: false })));
    };

    const handleShowCafeMarkers = () => {
        setInfo(null);
        setSelectedRestaurant(null);
        setFoodMarkers((prev) => prev.map((marker) => ({ ...marker, visible: false })));
        setCafeMarkers((prev) => prev.map((marker) => ({ ...marker, visible: true })));
    };

    const handleCurrentLocationClick = () => {
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setCurrentPosition({ latitude, longitude });
                    map.panTo(new window.kakao.maps.LatLng(latitude, longitude));
                    searchNearbyPlaces(latitude, longitude);
                },
                (error) => console.error("Error getting current location:", error)
            );
        } else {
            console.error("Geolocation is not supported by this browser or map is not initialized.");
        }
    };

    const handleRestaurantClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setInfo(restaurant);
        map.panTo(new window.kakao.maps.LatLng(restaurant.position.lat, restaurant.position.lng));
    };

    const allRestaurants = [...foodMarkers, ...cafeMarkers].filter(r => r.visible !== false);

    return (
        <Flex>
            <Box width="30%" mr={4}>
                <Heading size="md" mb={4}>식당 및 카페 목록</Heading>
                <Button onClick={handleShowFoodMarkers} mr={2} mb={4}><Text role="img" aria-label="Food">🌮</Text> 음식점</Button>
                <Button onClick={handleShowCafeMarkers} mb={4}><Text role="img" aria-label="Cafe">☕</Text> 카페</Button>
                <RestaurantList
                    restaurants={allRestaurants}
                    onRestaurantClick={handleRestaurantClick}
                />
            </Box>
            <Box width="70%">
                <Button onClick={handleCurrentLocationClick} mb={4}>현재 내 위치</Button>
                <Box id="map" style={{ width: "100%", height: "400px" }}>
                    {map && (
                        <Map
                            center={currentPosition ? { lat: currentPosition.latitude, lng: currentPosition.longitude } : { lat: 37.5662952, lng: 126.9779451 }}
                            style={{ width: "100%", height: "100%" }}
                            level={3}
                            onCreate={setMap}
                        >
                            {currentPosition && (
                                <MapMarker
                                    position={{ lat: currentPosition.latitude, lng: currentPosition.longitude }}
                                    image={{
                                        src: "/img/current.png",
                                        size: { width: 40, height: 40 },
                                        options: { offset: { x: 20, y: 40 } },
                                    }}
                                />
                            )}
                            {selectedRestaurant ? (
                                <MapMarker
                                    position={selectedRestaurant.position}
                                    image={{
                                        src: selectedRestaurant.place.category_group_code === "FD6" ? "/img/restaurant.png" : "/img/cafe.png",
                                        size: { width: 50, height: 50 },
                                    }}
                                    onClick={() => setInfo(selectedRestaurant)}
                                />
                            ) : (
                                <>
                                    {foodMarkers.filter(marker => marker.visible !== false).map((marker, index) => (
                                        <MapMarker
                                            key={`food-${index}`}
                                            position={marker.position}
                                            image={{
                                                src: "/img/restaurant.png",
                                                size: { width: 50, height: 50 },
                                            }}
                                            onClick={() => setInfo(marker)}
                                        />
                                    ))}
                                    {cafeMarkers.filter(marker => marker.visible !== false).map((marker, index) => (
                                        <MapMarker
                                            key={`cafe-${index}`}
                                            position={marker.position}
                                            image={{
                                                src: "/img/cafe.png",
                                                size: { width: 50, height: 50 },
                                            }}
                                            onClick={() => setInfo(marker)}
                                        />
                                    ))}
                                </>
                            )}
                            {info && (
                                <CustomOverlayMap position={info.position} yAnchor={1.4}>
                                    <Box
                                        bg="white"
                                        p={4}
                                        borderRadius="md"
                                        boxShadow="md"
                                        minWidth="200px"
                                        _after={{
                                            content: '""',
                                            position: 'absolute',
                                            bottom: "-10px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            borderWidth: "10px",
                                            borderStyle: "solid",
                                            borderColor: "white transparent transparent transparent",
                                        }}
                                    >
                                        <VStack spacing={2} align="stretch">
                                            <Link
                                                href={info.place.place_url}
                                                isExternal
                                                fontWeight="bold"
                                                fontSize="lg"
                                                color="teal.500"
                                                _hover={{ textDecoration: "underline" }}
                                            >
                                                {info.content}
                                            </Link>
                                            <Text fontSize="sm" color="gray.600">
                                                {info.place.road_address_name || info.place.address_name}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {info.place.phone}
                                            </Text>
                                        </VStack>
                                    </Box>
                                </CustomOverlayMap>
                            )}
                        </Map>
                    )}
                </Box>
            </Box>
        </Flex>
    );
}