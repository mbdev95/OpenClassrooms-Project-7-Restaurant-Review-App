import React from "react";
import PropTypes from "prop-types";
import {GoogleMap, Marker, useJsApiLoader, LoadScript, InfoWindow} from '@react-google-maps/api';
import axios from 'axios';
import JSONRestaurants from "../restaurants.json";
import star from "../img/star.svg";

// Determine how to still allow for infoWindow on map clicks to appear when clicking on pre-existing default google maps markers by using if condition with the click event on google map
 
const Map = (props) => {

    const {
        restaurants,
        showAllRestaurants,
        addedRestInfo,
        reviewToAddMap
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
                const refinedGoogleRestaurants = googlePlacesRestaurants.map( (restaurant) => {
                        let finalAddComp = "";
                        if ( restaurant.address_components.length === 5 ) {
                            finalAddComp = `, ${restaurant.address_components[4].long_name}`;
                        }
                        else if ( restaurant.address_components.length === 6 ) {
                            finalAddComp = `, ${restaurant.address_components[4].long_name}, ${restaurant.address_components[5].long_name}`;
                        } else if ( restaurant.address_components.length === 7 ) {
                            finalAddComp = `, ${restaurant.address_components[4].long_name}, ${restaurant.address_components[5].long_name}, ${restaurant.address_components[6].long_name}`;
                        } else if ( restaurant.address_components.length === 8 ) {
                            finalAddComp = `, ${restaurant.address_components[4].long_name}, ${restaurant.address_components[5].long_name}, ${restaurant.address_components[6].long_name}, ${restaurant.address_components[7].long_name}`;
                        } else if ( restaurant.address_components.length === 9 ) {
                            finalAddComp = `, ${restaurant.address_components[4].long_name}, ${restaurant.address_components[5].long_name}, ${restaurant.address_components[6].long_name}, ${restaurant.address_components[7].long_name}, ${restaurant.address_components[8].long_name}`;
                        } else {
                            finalAddComp = ``;
                        }
                        let restaurantRating = 0;
                        if ( restaurant.rating !== undefined ) {
                            restaurantRating = restaurant.rating;
                        }
                        let restaurantReviews = [];
                        if ( restaurant.reviews !== undefined ) {
                            restaurantReviews = restaurant.reviews;
                        }
                        return (
                            {
                                name: restaurant.name,
                                address: `${restaurant.address_components[0].long_name.replace("#", "")} ${restaurant.address_components[1].long_name}, ${restaurant.address_components[2].long_name}, ${restaurant.address_components[3].long_name}${finalAddComp}`,
                                lat: restaurant.geometry.location.lat,
                                long: restaurant.geometry.location.lng,
                                rating: restaurantRating,
                                reviews: restaurantReviews
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
                            const arrayRest = [];                              
                            response.data.results.forEach( restaurant => {
                                const url = `https://maps.googleapis.com/maps/api/place/details/json?`;
                                const place_id = `place_id=${restaurant.place_id}`;
                                const fields = `&fields=name,address_component,geometry,rating,reviews`;
                                const language =`&language=en`;
                                const key = `&key=AIzaSyBdSWlQIWlDeN2S1glNMA4zYYRQEWA1qyg`;
                                const restaurantReviewsSearch = url + place_id + fields + language + key;
                                axios.get("https://cors-mbdev.herokuapp.com/" + restaurantReviewsSearch)
                                .then(resp => {
                                    arrayRest.push(resp.data.result);
                                    if ( arrayRest.length === response.data.results.length ) {
                                        combinedRestaurantArrays(arrayRest);
                                    }
                                })
                                .catch(error => console.log(error));
                            })
                        } ).catch(error => console.log(error));
                    }, error);
                } else {
                    alert("Your browser currently does not support geolocation.  Please use a different browser.");
                } 
                
            }

            handleRestaurantSearch();

        }, []

    );

    const filteredRestaurantsArray = () => {
        if ( restaurants.length > 0 && showAllRestaurants === false ) {
            const refinedGoogleRestaurants = restaurants.map( (restaurant) =>
                { 
                    return (
                        {
                            name: restaurant.name,
                            address: restaurant.address,
                            lat: restaurant.lat,
                            long: restaurant.long,
                            rating: restaurant.rating,
                            reviews: restaurant.reviews
                        }
                    )
                }
            );
            return refinedGoogleRestaurants
        } else if ( restaurants.length === 0 && showAllRestaurants === false ) {
            return [];
        } else if ( showAllRestaurants === true ) {
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

    const [displayRestInfo, setDisplayRestInfo] = React.useState(null);

    const [displayRestPhoto, setDisplayRestPhoto] = React.useState("");

    const starHighlight = (starPosition) => {
        if ( starPosition <= Math.round(displayRestInfo.rating) ) {
            return "yellowStar";
        } else {
            return "";
        }
    }

    const reviewYellowStars = (numberStars, starPosition) => {
        if ( starPosition <= numberStars ) {
            return "yellowStar";
        } else {          
            return "";
        }
    }

    const addedRestInfoForMap = mapAddedRestInfo => {
        const updatedMapRest = totalRestaurantList.concat(mapAddedRestInfo);
        setTotalRestaurantList(updatedMapRest);
    }

    const [addRestaurantForm, setAddRestaurantForm] = React.useState(null);

    const location = (restaurant) => {
        let location;
        restaurant.newlyAddedRest ? location = restaurant.position : 
        location = {
            lat: parseFloat(restaurant.lat),
            lng: parseFloat(restaurant.long)
        }
        return location; 
    }
    
    const newReview = (restaurant) => {
        if ( reviewToAddMap.length > 0 && restaurant.name === reviewToAddMap[reviewToAddMap.length - 1].name ) {
            return true;
        } else {
            return false;
        }
    }

    return isLoaded ? (
        <div className="col-md-8 map">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={ position }
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={ event =>  
                    { 
                        setDisplayRestInfo(null);
                        if ( event.Va !== undefined ) {
                            setAddRestaurantForm(event.latLng);
                        } 
                    }
                }
            >

                <Marker 
                    position={ position } 
                    onClick={ () => {
                            setDisplayRestInfo(null);
                            setAddRestaurantForm(null);
                        }
                    }
                />

                {
                    addRestaurantForm && (
                        <InfoWindow
                            onCloseClick={() => setAddRestaurantForm(null)}
                            position={addRestaurantForm}
                        >
                            <form>
                                <h5>Add A New Restaurant</h5>
                                <div className="form-group">
                                    <label htmlFor="restaurantName"><strong>Restaurant Name<span>&#x3a;</span></strong></label>
                                    <input type="name" className="form-control" id="restaurantName" placeholder="Enter restaurant name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="restaurantAddress"><strong>Restaurant Address<span>&#x3a;</span></strong></label>
                                    <input type="address" className="form-control" id="restaurantAddress" placeholder="Enter restaurant address" />
                                </div>
                                <button type="submit" className="btn btn-primary" onClick={ (event) => {
                                    const nameInput = document.getElementById("restaurantName");
                                    const addressInput = document.getElementById("restaurantAddress");
                                    event.preventDefault();
                                    if ( nameInput.value === "" || addressInput.value === "" ) {
                                        alert("Please fill in an address and name for the restaurant before adding the restaurant.");
                                    } else {
                                        const addedRestaurantInfo = [
                                            {
                                                id: totalRestaurantList.length + 1,
                                                name: nameInput.value,
                                                address: addressInput.value,
                                                position: addRestaurantForm,
                                                rating: 0,
                                                reviews: [],
                                                newlyAddedRest: true
                                            }
                                        ]
                                        addedRestInfoForMap(addedRestaurantInfo);
                                        addedRestInfo(addedRestaurantInfo);
                                        setAddRestaurantForm(null);
                                    }
                                } } >Add Restaurant</button>
                            </form>
                        </InfoWindow>
                    )
                }

                {
                    filteredRestaurantsArray().map((restaurant, index) => {

                        return (
                            <Marker 
                                position={ location(restaurant) }

                                onClick={ () => 
                                    {
                                        setDisplayRestInfo(restaurant);
                                        const url = `https://maps.googleapis.com/maps/api/streetview?`;
                                        const size = `size=210x180`;
                                        const location = `&location=${restaurant.address}`;
                                        const key = `&key=AIzaSyBdSWlQIWlDeN2S1glNMA4zYYRQEWA1qyg`;
                                        const restaurantImage = url + size + location + key;
                                        setDisplayRestPhoto(restaurantImage);
                                        setAddRestaurantForm(null);
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
                {
                    displayRestInfo && (
                        <InfoWindow
                            onCloseClick={() => setDisplayRestInfo(null)}
                            position= { location(displayRestInfo) }
                        >
                            <div className="infoWindow">
                                <h5><strong>{displayRestInfo.name}</strong></h5>
                                <p>{displayRestInfo.address}</p>
                                <img alt={displayRestInfo.name} src={displayRestPhoto} />
                                <div>
                                    <h5>Rating<span>&#x3a;</span></h5>
                                    <img src={star} alt="star" className={ starHighlight(1) } />
                                    <img src={star} alt="star" className={ starHighlight(2) } />
                                    <img src={star} alt="star" className={ starHighlight(3) } />
                                    <img src={star} alt="star" className={ starHighlight(4) } />
                                    <img src={star} alt="star" className={ starHighlight(5) } />
                                </div>
                                <h5>Reviews</h5>
                                { 
                                    newReview(displayRestInfo) ? reviewToAddMap.map( (review, index) => 
                                        {
                                            const removeAccents = require("diacritic");
                                            return (
                                                <div className="restaurantReview" key={index}>
                                                    <div>
                                                        <p><strong>Rating<span>&#x3a;</span></strong></p>
                                                        <img src={star} alt="star" className={ reviewYellowStars(review.rating, 1) } />
                                                        <img key={index + 1800} src={star} alt="star" className={ reviewYellowStars(review.rating, 2) } />
                                                        <img key={index + 2400} src={star} alt="star" className={ reviewYellowStars(review.rating, 3) } />
                                                        <img key={index + 3000} src={star} alt="star" className={ reviewYellowStars(review.rating, 4) } />
                                                        <img key={index + 3600} src={star} alt="star" className={ reviewYellowStars(review.rating, 5) } />                                           
                                                    </div>
                                                    <p><strong>Comment<span>&#x3a;</span></strong><span className="comment"> {removeAccents.clean(review.text)}</span></p>
                                                </div>
                                            );
                                        }
                                    ) : displayRestInfo.reviews.map( (review, index) => 
                                        {
                                            const removeAccents = require("diacritic");
                                            return (
                                                <div className="restaurantReview" key={index}>
                                                    <div>
                                                        <p><strong>Rating<span>&#x3a;</span></strong></p>
                                                        <img src={star} alt="star" className={ reviewYellowStars(review.rating, 1) } />
                                                        <img key={index + 1800} src={star} alt="star" className={ reviewYellowStars(review.rating, 2) } />
                                                        <img key={index + 2400} src={star} alt="star" className={ reviewYellowStars(review.rating, 3) } />
                                                        <img key={index + 3000} src={star} alt="star" className={ reviewYellowStars(review.rating, 4) } />
                                                        <img key={index + 3600} src={star} alt="star" className={ reviewYellowStars(review.rating, 5) } />                                           
                                                    </div>
                                                    <p><strong>Comment<span>&#x3a;</span></strong><span className="comment"> {removeAccents.clean(review.text)}</span></p>
                                                </div>
                                            );
                                        }
                                    ) 
                                }
                            </div>
                        </InfoWindow>
                    )
                }
                <></>
            </GoogleMap>
        </div>
    ): <></>
}

Map.propTypes = {
    restaurants: PropTypes.array,
    showAllRestaurants: PropTypes.bool,
    addedRestInfo: PropTypes.func,
    reviewToAddMap: PropTypes.array
};

export default React.memo(Map);