import React from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import JSONRestaurants from "../restaurants.json";
import Star from "../img/star.svg";

//return all required information about each restaurant including, name, review.rating, review.text, address_component, and lat/ long all as a part of one api query, all the information can then go into an array which is then access to be the value of the various components of eachr estaurants listing.
const RestaurantList = (props) => {

    const {
        restArray,
        restaurants,
        showAllRestaurants
    } = props

    const reviewYellowStars = (numberStars, starPosition) => {
        if ( starPosition <= numberStars ) {
            return "yellowStar";
        } else {          
            return "";
        }
    }

    const [totalRestaurantList, setTotalRestaurantList] = React.useState([]);

    React.useEffect( () => 

        {
            const combinedRestaurantArrays = (googlePlacesRestaurants) => {
                const removeAccents = require("diacritic");
                const refinedGoogleRestaurants = googlePlacesRestaurants.map( (restaurant, index) =>
                    {  
                        let finalAddComp = ""; 
                        if ( restaurant.address_components.length === 7 ) {
                            finalAddComp = `, ${restaurant.address_components[6].long_name}`;
                        } 
                        return (  
                            {
                                place_id: restaurant.place_id,
                                id: index + 9,
                                name: removeAccents.clean(restaurant.name),
                                address: `${restaurant.address_components[0].long_name} ${restaurant.address_components[1].long_name}, ${restaurant.address_components[2].long_name}, ${restaurant.address_components[3].long_name}, ${restaurant.address_components[4].long_name}, ${restaurant.address_components[5].long_name}${finalAddComp}`,
                                lat: restaurant.geometry.location.lat,
                                long: restaurant.geometry.location.lng,
                                rating: restaurant.rating,
                                reviews: restaurant.reviews
                            }
                        )
                    }
                );
                const finalRestaurantArray = [...JSONRestaurants, ...refinedGoogleRestaurants];
                setTotalRestaurantList(finalRestaurantArray);
                restArray(finalRestaurantArray);
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
                                const fields = `&fields=name,place_id,address_component,geometry,rating,review`;
                                const language =`&language=en`;
                                const key = `&key=AIzaSyBdSWlQIWlDeN2S1glNMA4zYYRQEWA1qyg`
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
        }, [restArray]

    );

    const filteredRestaurantsArray = () => {
        if ( restaurants.length > 0 && showAllRestaurants === false ) {
            return restaurants;
        } else if ( restaurants.length === 0 && showAllRestaurants === false ) {
            return [];
        } else if ( showAllRestaurants === true ) {
            return totalRestaurantList;
        }
    }


    return (
        <div className="reviewList">
            <h2>Restaurants</h2>
            <ul className="list-group">
                { filteredRestaurantsArray().map((restaurant, index) => {
                        return (
                            <li className="list-group-item" key={restaurant.id}>
                                <span key={restaurant.id * (index + 1) + 1} className="name">{restaurant.name}</span>
                                <p><span key={restaurant.id * (index + 1) + 2} className="address" >{restaurant.address}</span></p>
                                <div>
                                    <h4>Overall Rating<span>&#x3a;</span></h4>
                                    <img src={Star} alt="star" className={ reviewYellowStars(Math.round(restaurant.rating), 1) } />
                                    <img src={Star} alt="star" className={ reviewYellowStars(Math.round(restaurant.rating), 2) } />
                                    <img src={Star} alt="star" className={ reviewYellowStars(Math.round(restaurant.rating), 3) } />
                                    <img src={Star} alt="star" className={ reviewYellowStars(Math.round(restaurant.rating), 4) } />
                                    <img src={Star} alt="star" className={ reviewYellowStars(Math.round(restaurant.rating), 5) } />
                                </div>
                                <h4 key={restaurant.id * (index + 1) + 3}>Reviews</h4>
                                { restaurant.reviews.map((review, i ) => {
                                        const removeAccents = require("diacritic");
                                        return (
                                            <div key={restaurant.id * (index + 1) + 4 + i} className="restaurantReview">
                                                <p>Rating<span>&#x3a;</span>
                                                    <img src={Star} alt="star" className={ reviewYellowStars(review.rating, 1) } />
                                                    <img src={Star} alt="star" className={ reviewYellowStars(review.rating, 2) } />
                                                    <img src={Star} alt="star" className={ reviewYellowStars(review.rating, 3) } />
                                                    <img src={Star} alt="star" className={ reviewYellowStars(review.rating, 4) } />
                                                    <img src={Star} alt="star" className={ reviewYellowStars(review.rating, 5) } />
                                                </p>
                                                <p>Comment<span className="lead comment">&#x3a; {removeAccents.clean(review.text)}</span></p>
                                            </div>
                                        )
                                    }
                                ) }
                            </li>
                        )
                    }
                ) }
            </ul>
        </div>
    );
}

RestaurantList.propTypes = {
    restArray: PropTypes.func,
    restaurants: PropTypes.array,
    showAllRestaurants: PropTypes.bool
}

export default RestaurantList;