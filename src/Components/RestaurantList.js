import React from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import Star from "../img/star.svg";

const RestaurantList = (props) => {

    const {
        restArray,
        restaurants,
        showAllRestaurants,
        addedRestInfo,
        reviewToAddMap
    } = props

    /* reviewYellowStars()
    - ARGUEMENT - numberStars - The rating for an individual review in the restaurant's infowindow.
    - ARGUEMENT - starPosition - The position of the star's image in the grouping of stars in an individual's review in the infowindow.
    - RESULT - If the individual's review's rating is less than or equal to the star's position then the star is coloured yellow otherwise the star remains unchanged in colour.
    */
    const reviewYellowStars = (numberStars, starPosition) => {
        if ( starPosition <= numberStars ) {
            return "yellowStar";
        } else {          
            return "";
        }
    }

    // The state of the totalRestaurantList used to hold all the restaurant's information in objects is initialized to an empty array.
    const [totalRestaurantList, setTotalRestaurantList] = React.useState([]);

    // A boolean value which if true indicates the total restaurant list array has been created from the api get request.
    const [totalRestaurantListBool, setTotalRestaurantListBool] = React.useState(false);

    //The useEffect will be executed every time a new restaurant is added via the form by the make this useEffect have an empty dependency array.
    React.useEffect( () => 

        {
    /* combinedRestaurantArrays()
        - Arguement - googlePlacesRestaurants - An array of restaurant's objects loaded from the googlePlacesApi which is loaded using the restaurants googlePlaces id loaded from the google maps Api.
        - Results - An array of objects containing each restaurant's data from the Google Places API is set to state as refined restaurants.
        - The array of restaurant data is also passed up to the parent Main component via the callback function restArray().
    */
            const combinedRestaurantArrays = (googlePlacesRestaurants) => {
                const removeAccents = require("diacritic");
                const refinedGoogleRestaurants = googlePlacesRestaurants.map( (restaurant, index) =>
                    {   
                        let finalAddComp = ""; 
                        if ( restaurant.address_components.length === 6 ) {
                            finalAddComp = `, ${restaurant.address_components[5].long_name}`;
                        } else if ( restaurant.address_components.length === 7 ) {
                            finalAddComp = `, ${restaurant.address_components[5].long_name}, ${restaurant.address_components[6].long_name}`;
                        } else if ( restaurant.address_components.length === 8 ) {
                            finalAddComp = `, ${restaurant.address_components[5].long_name}, ${restaurant.address_components[6].long_name}, ${restaurant.address_components[7].long_name}`;
                        } else if ( restaurant.address_components.length === 9 ) {
                            finalAddComp = `, ${restaurant.address_components[5].long_name}, ${restaurant.address_components[6].long_name}, ${restaurant.address_components[7].long_name}, ${restaurant.address_components[8].long_name}`;
                        } else {
                            finalAddComp = ``;
                        }
                        let restaurantRating = 0;
                        if ( restaurant.rating !== undefined ) {
                            restaurantRating = restaurant.rating;
                        }
                        let restaurantReviews = [];
                        if ( restaurant.reviews !== undefined ) {
                            restaurantReviews = restaurant.reviews.map(review => {
                               return (
                                {
                                    restName: restaurant.name,
                                    rating: review.rating,
                                    text: review.text
                                }
                               )
                           })                        
                        }
                        return (  
                            {
                                place_id: restaurant.place_id,
                                id: index + 9,
                                name: removeAccents.clean(restaurant.name),
                                address: `${restaurant.address_components[0].long_name.replace("#", "")} ${restaurant.address_components[1].long_name}, ${restaurant.address_components[2].long_name}, ${restaurant.address_components[3].long_name}, ${restaurant.address_components[4].long_name}${finalAddComp}`,                                lat: restaurant.geometry.location.lat,
                                long: restaurant.geometry.location.lng,
                                newReview: false,
                                rating: restaurantRating,
                                reviews: restaurantReviews
                            }
                        )
                    }
                );
                setTotalRestaurantList(refinedGoogleRestaurants);
                setTotalRestaurantListBool(true);
                restArray(finalRestaurantArray);
            };
    /* handleRestaurantSearch(
    - RESULT - The combinedRestaurantArray() function is called with an array of objects containing each restaurants required information is passed through as the arguement.
        -Immediantly after this function declaration the handleRestaurantSearch() function is called inorder to have the function executed once upon the first rendering of the map component.
    */
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

    // A couple of API get requests are made to Google to obtain data about restaurants within 2000m of the user.
    // This array of data is passed to the combinedRestaurantArrays function where the data formatted into an array of restaurant objects.
    // Herokuapp's server is used to avoid the cors error for the google maps api request and for the google places api request I created my own server "cors-mbdev" to deal with any cors errors since the app's requests exceeded the minimum allowed by herokuapp. 
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
                        const key = `&key=key`;
                        const restaurantSearchUrl = url + location + radius + type + key;
                        axios.get("https://secret-ocean-49799.herokuapp.com/" + restaurantSearchUrl)
                        .then(response => {  
                            const arrayRest = [];                              
                            response.data.results.forEach( restaurant => {
                                const url = `https://maps.googleapis.com/maps/api/place/details/json?`;
                                const place_id = `place_id=${restaurant.place_id}`;
                                const fields = `&fields=name,place_id,address_component,geometry,rating,review`;
                                const language =`&language=en`;
                                const key = `&key=key`
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

    // - Every time a new list item is submitted the addedRestInfo prop is altered causing the below code to be executed.
    // - The current totalRestaurantList and addedRestInfo are combined into one array and set the new value of state for totalRestaurantList.
    // - The array containing the newly added restaurant is then passed to be included in restaurants being filtered.
    React.useEffect( () => {
            const totalRestPlusAddedRest = [...totalRestaurantList, ...addedRestInfo];
            setTotalRestaurantList(totalRestPlusAddedRest);
        }, [addedRestInfo, restArray]
    );
    
    /* filteredRestaurantsArray() 
    - RESULTS - A condition to determine which array of restaurant information will be iterated through to show all the restaurants in the list.
    */
    const filteredRestaurantsArray = () => {
        if ( restaurants.length > 0 && showAllRestaurants === false ) {
            return restaurants;
        } else if ( restaurants.length === 0 && showAllRestaurants === false ) {
            return [];
        } else if ( showAllRestaurants === true ) {
            return totalRestaurantList;
        } 
    }

    // - The restaurantToBeAdded state is initialized to an object.  The restaurantToBeAdded represents the restaurant information object pertaining to the restaurant in the restaurant list which had it's add review button clicked so the modal window add review form can be opened. 
    // - The restaurant information comes from the object iteration of the filteredRestaurant's array.
    const [restaurantToBeAdded, setRestaurantToBeAdded] = React.useState({});

    // - The addedStarRating represents the rating a user chooses when they are rating a restaurant.
    const [addedStarRating, setAddedStarRating] = React.useState(0);

    // - The newReviewsToAdd represents an array of all the reviews for the restaurant which just had a review added.  The reviews array will include the added review.
    const [newReviewsToAdd, setNewReviewsToAdd] = React.useState([]);

    /* starHighlight()
    - ARGUEMENT - starPosition - The position of the star within the group of 5 stars within the add review modal window.
    - RESULT - If the starPosition is less than or equal to the addedStarRating (the rating the user chose), then the star will be coloured yellow, else the star will be blank.
    */
    const starHighlight = (starPosition) => {
        if ( starPosition <= addedStarRating ) {
            return "yellowStar";
        } else {
            return "";
        }
    }

    /* restaurantReviews()
    - ARGUEMENT - restaurant - The restaurant information object pertaining to the marker that was clicked on.
    - RESULT - The reviewToAddMap prop contains any newly added reviews plus any other existing reviews from the restaurant which had a review added by the user.
        - If the reviewToAddMap is defined with a length greater then zero this array containing additional and previous reviews is used, otherwise the array containing already existing reviews is used.
    */
    const restaurantReviews = (restaurant) => {
        const reviewsToAddToCurrentRestaurant = newReviewsToAdd.filter(review => restaurant.name === review.restName);
        if ( reviewsToAddToCurrentRestaurant.length > 0 ) {
            return reviewsToAddToCurrentRestaurant;
        } else {
            return restaurant.reviews;
        }
    }

    return (
        <div className="reviewList">
            <h2>Restaurants</h2>
            <ul className="list-group">
    {/* filteredRestaurantsArray()
    - RESULT - The restaurant list is rendered with the data from the google API as long as API get request has been fully resolved. 
     */}
                {   
                    totalRestaurantListBool ? filteredRestaurantsArray().map((restaurant, index) => {
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
                                { 
                                    restaurantReviews(restaurant).map((review, i) => {
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
                                    })
                                }

                                <div className="modal" id="addReviewModal" tabIndex="-1" aria-labelledby="addReview">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">{`Add Reviews For ${restaurantToBeAdded.name}`}</h4>
                                                <button type="button" onClick={ () => {
                                                    document.getElementById("addReviewModal").style.display = "none";
                                                    document.getElementsByTagName("textarea")[0].value = "";
                                                    document.getElementsByTagName("textarea")[0].placeholder = "Add your review here...";
                                                    setAddedStarRating(0);
                                                } }>X</button>
                                            </div>
                                            <div className="modal-body">
                                                <div id="reviewTextArea" >
                                                    <div>
                                                        <p>Rating<strong><span>&#x3a;</span></strong></p>
                                                        <img src={Star} alt="star" className={ starHighlight(1) } onClick={ () => setAddedStarRating(1) } />
                                                        <img src={Star} alt="star" className={ starHighlight(2) } onClick={ () => setAddedStarRating(2) } />
                                                        <img src={Star} alt="star" className={ starHighlight(3) } onClick={ () => setAddedStarRating(3) } />
                                                        <img src={Star} alt="star" className={ starHighlight(4) } onClick={ () => setAddedStarRating(4) } />
                                                        <img src={Star} alt="star" className={ starHighlight(5) } onClick={ () => setAddedStarRating(5) } />
                                                    </div>
                                                    <label htmlFor="reviewText">Review Comment<strong><span>&#x3a;</span></strong></label>
                                                    <textarea type="text" id="reviewText" name="reviewText" rows="7" placeholder="Add you review here..." onFocus={ () => document.getElementsByTagName("textarea")[0].placeholder = "" } onBlur={ () => document.getElementsByTagName("textarea")[0].placeholder = "Add you review here..." } />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={ () => {
                                                    document.getElementById("addReviewModal").style.display = "none";
                                                    document.getElementsByTagName("textarea")[0].value = "";
                                                    document.getElementsByTagName("textarea")[0].placeholder = "Add your review here...";
                                                    setAddedStarRating(0);
                                                } } >Close</button>
                                                <button type="button" className="btn btn-primary" onClick={ () => {
                                                    if ( addedStarRating === 0 && document.getElementsByTagName("textarea")[0].value !== "" ) {
                                                        alert(`Please select a rating for ${restaurantToBeAdded.name} before submitting your review.`);
                                                    } else if ( addedStarRating > 0 && document.getElementsByTagName("textarea")[0].value === "" ) {
                                                        alert(`Please write a review for ${restaurantToBeAdded.name} before submitting your review.`);
                                                    } else if ( addedStarRating === 0 && document.getElementsByTagName("textarea")[0].value === "" ) {
                                                        alert(`Please give a rating and write a review for ${restaurantToBeAdded.name} before submitting your review.`);
                                                    } else if ( addedStarRating > 0 && document.getElementsByTagName("textarea")[0].value !== "" ) {
                                                        const newReview = [...totalRestaurantList[restaurantToBeAdded.id - 1].reviews, ...[ 
                                                                {
                                                                    restName: restaurantToBeAdded.name,
                                                                    rating: addedStarRating,
                                                                    text: document.getElementsByTagName("textarea")[0].value
                                                                } 
                                                            ]
                                                        ]
                                                        if ( totalRestaurantList[restaurantToBeAdded.id - 1].rating === 0 ) {
                                                            totalRestaurantList[restaurantToBeAdded.id - 1].rating = addedStarRating;
                                                            restArray(totalRestaurantList);
                                                        }
                                                        const totalNewReviews = [...newReviewsToAdd, ...newReview];
                                                        setNewReviewsToAdd(totalNewReviews);
                                                        reviewToAddMap(totalNewReviews);
                                                        document.getElementById("addReviewModal").style.display = "none";
                                                        document.getElementsByTagName("textarea")[0].value = "";
                                                        document.getElementsByTagName("textarea")[0].placeholder = "Add your review here...";
                                                        setAddedStarRating(0);
                                                    }
                                                } }>Add Review</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" className="btn btn-primary btn-open" onClick={ () => {
                                        if ( newReviewsToAdd.length > 0 && newReviewsToAdd[newReviewsToAdd.length - 1].restName === restaurant.name ) {
                                            alert("You can only add one review per restaurant.");
                                        } else {
                                            document.getElementById("addReviewModal").style.display = "block";
                                            document.getElementById("addReviewModal").style.marginTop = "100px";
                                            document.getElementsByClassName("modal-content")[0].style.border = "2px solid black";
                                            document.getElementsByClassName("modal-footer")[0].style.borderTop = "1px solid black";
                                            document.getElementsByClassName("modal-dialog")[0].style.borderBottom = "none";
                                            document.getElementById("reviewTextArea").style.borderBottom = "none";
                                            document.getElementById("reviewTextArea").style.flexDirection = "column";
                                            setRestaurantToBeAdded(restaurant);
                                        }
                                    }
                                } >Add Review</button>

                            </li>
                        )
                    }
                ) : ""
                }
            </ul>
        </div>
    );
}

RestaurantList.propTypes = {
    restArray: PropTypes.func,
    restaurants: PropTypes.array,
    showAllRestaurants: PropTypes.bool,
    addedRestInfo: PropTypes.array,
    reviewToAddMap: PropTypes.func
}

export default RestaurantList;
