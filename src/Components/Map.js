import React from "react";
import PropTypes from "prop-types";
import {GoogleMap, Marker, useJsApiLoader, LoadScript, InfoWindow} from '@react-google-maps/api';
import axios from 'axios';
import JSONRestaurants from "../restaurants.json"
 
const Map = (props) => {

    const {
        restaurants,
        filterActive
    } = props

    const { isLoaded } = useJsApiLoader({
       id: 'restaurant-locator-308917',
       googleMapsApiKey: "AIzaSyBdSWlQIWlDeN2S1glNMA4zYYRQEWA1qyg"
    })

    const containerStyle = {
        height: "100%",
        width: "100%"
    };

    // function to deal with error resulting from a browser not having location permissions enabled
    const error = () => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(res => {
                if (res.state === 'denied') {
                alert('Enable location permissions for this website in your browser settings.')
                }
            })
        }
    }

    //Using state to hold the user location
    const [position, setPosition] = React.useState({});
    if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition(
                {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            )
        }, error )
    } else {
        alert("Your browser currently does not support geolocation.  Please use a different browser.");
    }

    const [totalRestaurantList, setTotalRestaurantList] = React.useState([]);

    React.useEffect( () => 

        {
            const combinedRestaurantArrays = (googlePlacesRestaurants) => {
                const refinedGoogleRestaurants = googlePlacesRestaurants.map( (restaurant) =>
                    { 
                        return (
                            {
                                lat: restaurant.geometry.location.lat,
                                long: restaurant.geometry.location.lng,
                            }
                        )
                    }
                );
                const finalRestaurantArray = [...JSONRestaurants, ...refinedGoogleRestaurants];
                setTotalRestaurantList(finalRestaurantArray);
            };

            const handleRestaurantSearch = () => {

                // function to deal with error resulting from a browser not having location permissions enabled
                const error = () => {
                    if (navigator.permissions) {
                        navigator.permissions.query({ name: 'geolocation' }).then(res => {
                            if (res.state === 'denied') {
                                alert('Enable location permissions for this website in your browser settings.')
                            }
                        })
                    }
                }

                // If geolocation is present in the browser then the use state is updated to the computers currents latitude and longitude
                let latitude;
                let longitude;
                if ( navigator.geolocation ) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;
                        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
                        const location = `location=${latitude},${longitude}`;
                        const radius = `&radius=2000`;
                        const type = `&type=restaurant`;
                        const key = `&key=AIzaSyBdSWlQIWlDeN2S1glNMA4zYYRQEWA1qyg`;
                        const restaurantSearchUrl = url + location + radius + type + key;
                        axios.get("https://secret-ocean-49799.herokuapp.com/" + restaurantSearchUrl)
                            .then(response => {
                                    combinedRestaurantArrays(response.data.results);
                                }
                            ).catch(error => console.log(error));
                    }, error);
                } else {
                    alert("Your browser currently does not support geolocation.  Please use a different browser.");
                }
                
            }

            handleRestaurantSearch();

        }, []

    );

    const filteredRestaurantsArray = () => {
        if ( restaurants.length > 0 ) {
            const refinedGoogleRestaurants = restaurants.map( (restaurant) =>
                { 
                    return (
                        {
                            lat: restaurant.lat,
                            long: restaurant.long,
                        }
                    )
                }
            );
            return refinedGoogleRestaurants
        } else {
            return totalRestaurantList;
        }
    }

  
    const [map, setMap] = React.useState(null)
  
    const onLoad = React.useCallback(function callback(map) {
       const bounds = new window.google.maps.LatLngBounds();
    //    map.fitBounds(bounds);
       setMap(map)
    }, [])
  
    const onUnmount = React.useCallback(function callback(map) {
       setMap(null)
    }, [])
  
    return isLoaded ? (
        <div className="col-md-8 map">
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
        <Marker position={position} />
        {
            filteredRestaurantsArray().map((restaurant, index) => {
                return (
                    <Marker 
                        position={ 
                            {
                                lat: parseFloat(restaurant.lat),
                                lng: parseFloat(restaurant.long)
                            } 
                        } 

                        key={index}

                        icon= {
                            {
                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            }
                        }                         
                    />
                )
            })
        }
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
        </GoogleMap>
        </div>
    ): <></>
}

Map.propTypes = {
    restaurants: PropTypes.array,
    filterActive: PropTypes.bool
};

export default React.memo(Map);