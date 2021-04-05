import React from "react";
import axios from 'axios';
import JSONRestaurants from "../restaurants.json";
import Star from "../img/star.svg";

//return all required information about each restaurant including, name, review.rating, review.text, address_component, and lat/ long all as a part of one api query, all the information can then go into an array which is then access to be the value of the various components of eachr estaurants listing.
const RestaurantList = () => {

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
                const refinedGoogleRestaurants = googlePlacesRestaurants.map( (restaurant, index) =>
                    {            
                        return (
                            {
                                place_id: restaurant.place_id,
                                id: index + 9,
                                restaurantName: restaurant.name,
                                address: restaurant.vicinity + " Chiapas, Mexico",
                                lat: restaurant.geometry.location.lat,
                                long: restaurant.geometry.location.lng,
                                ratings: [
                                    {
                                        stars: 0,
                                        comment: ""
                                    }
                                ]
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
                                const fields = `&fields=name,place_id,photo,address_component,geometry,review`;
                                const key = `&key=AIzaSyBdSWlQIWlDeN2S1glNMA4zYYRQEWA1qyg`
                                const restaurantReviewsSearch = url + place_id + fields + key;
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

    return (
        <div className="reviewList">
            <h2>Restaurants</h2>
            <ul className="list-group">
                { totalRestaurantList.map((restaurant, index) => {
                        return (
                            // ref={listItem} should be placed in the list to reference the list item so that item can appear when the restaurant corresponding to the list item is clicked on the map.
                            <li className="list-group-item" key={restaurant.id}>
                                <h3 key={restaurant.id * (index + 1) + 1} >{restaurant.restaurantName}</h3>
                                <p key={restaurant.id * (index + 1) + 2} >{restaurant.address}</p>
                                <h5 key={restaurant.id * (index + 1) + 3}>Reviews</h5>
                                { restaurant.ratings.map((rating, i ) => {
                                        return (
                                            <div key={restaurant.id * (index + 1) + 4 + i}>
                                                <p>Rating<span>&#x3a;</span>
                                                    <img src={Star} alt="star" className={ reviewYellowStars(rating.stars, 1) } />
                                                    <img src={Star} alt="star" className={ reviewYellowStars(rating.stars, 2) } />
                                                    <img src={Star} alt="star" className={ reviewYellowStars(rating.stars, 3) } />
                                                    <img src={Star} alt="star" className={ reviewYellowStars(rating.stars, 4) } />
                                                    <img src={Star} alt="star" className={ reviewYellowStars(rating.stars, 5) } />
                                                </p>
                                                <p>Comment<span>&#x3a;</span> {rating.comment}</p>
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

export default RestaurantList;