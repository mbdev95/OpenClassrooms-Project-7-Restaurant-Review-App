import React from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import JSONRestaurants from "../restaurants.json";
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
        - Results - The googlePlacesRestaurants array is maped through returning an array of objects to the refinedGoogleRestaurants variable, and contains all the required information for the restaurant's marker's location and the restaurant's infowindow.
        - The address is formed by taking the minimum address length and then concacting the remainder of the address components on the basis of the number of address components remaining.
        - The restaurantReviews object includes the name of the restaurant being reviewed because this name will be needed in a condition comparing the review's restaurant's name with all the restaurant's which have had restaurant's added in order to determine which array of reviews should be rendered to the DOM for each restaurant.
        - The JSON restaurants and google api restaurants are combined into one array using the spread operator.  The resulting array then becomes the state for totalRestaurantList.
        - The totalRestaurantListBool value has been set to true since the api's have loaded all of the information for each restaurant and totalRestaurantList state has been updated with the array containing the restaurant information.  Thus, the restaurantList is ready to be rendered since totalRestaurantList is now an iterable defined array.
        - The restArray prop function takes the value of the totalRestaurants as it's arguement which will then be passed to the filter, and used as another arguement in the filter function to give the filterfunction in Main the most up to date restaurant information, including restaurants just added.  
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
                const finalRestaurantArray = [...JSONRestaurants, ...refinedGoogleRestaurants];
                setTotalRestaurantList(finalRestaurantArray);
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

    // If geolocation is present in the browser then the googleMaps Api is executed.
    // The latitude and longitude variables are set to there values given from the position arguement passed into the function using the browser's geolocation feature.
    // A google maps api uses the latitude and longitude variables to determine the location from which to locate the restaurants.  The radius is set to 2000 meters and the type is set to restaurant.  The api key is provided and axios is used in conjunction with a get request to return an array of restaurants with a place ID.
    // Herokuapp's server is used to avoid the cors error for the google maps api request and for the google places api request I created my own server "cors-mbdev" to deal with any cors errors since the app's requests exceeded the minimum allowed by herokuapp. 
    // A new array is initialized and the results of the previous google maps api are iterated through.  The place id is used in each iteration to target and return more information from each restaurant which is then pushed into the initialized array.
    // The arrayRest has the length of the initial array from google maps api then the array rest has all the restaurants information and thus this array is passed to combinedRestaurantArrays so this array can be used to ultimately update the totalRestaurantList.
    // If the promise recieves an error the error is logged to the console, and if geolocation does not work an alert appears informing the user their browser does not have geolocation.
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
                        const key = `&key=hiddenKey`;
                        const restaurantSearchUrl = url + location + radius + type + key;
                        axios.get("https://secret-ocean-49799.herokuapp.com/" + restaurantSearchUrl)
                        .then(response => {  
                            const arrayRest = [];                              
                            response.data.results.forEach( restaurant => {
                                const url = `https://maps.googleapis.com/maps/api/place/details/json?`;
                                const place_id = `place_id=${restaurant.place_id}`;
                                const fields = `&fields=name,place_id,address_component,geometry,rating,review`;
                                const language =`&language=en`;
                                const key = `&key=hiddenKey`
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
        - Condition 1 determines if the filter has been used, and if the rating selected matches the rating of any restaurants. If true the restaurants which have the same rating as the rating selected will be returned.
        - Condition 2 determines if the filter has been used, and will only be true if the rating selected yields no restaurants, thus returning an empty array.
        - Condition 3 determines if the filter has been used, and will only be true if the filter was not used returning all the restaurants.
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
        - The reviewToAddMap is filtered on the basis of the restaurant whose marker was clicked on's name and the name of the restaurant which has had a review added being the same. If the same then all the reviews from the restaurant with added review will be placed in the reviewsToAddToCurrentRestaurant variable.
        - If reviews were added to the restaurant being iterated through then the reviewsToAddToCurrentRestaurant array is returned and the reviews including the review added by the user are rendered to the restaurant's infowindow.
        - If no reviews were added to the restaurant being iterated through then the restaurant's original reviews are returned without any additional reviews.
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
    - RESULT - A ternary expression is used to determine if the totalRestaurantList is loaded from the api get requests before loading the page to avoid an undefined error.
        - The filteredRestaurantsArray represents an array representing the restaurants based on 3 conditions determining if the array has been filtered, if the filter has yielded any restaurants, or if the filter has been used at all, in which case all restaurants will be returned.
        - The restaurantReviews() function returns an array of reviews which will either include any added reviews, or include just the original reviews if the condition in the function determines that no reviews were added for the particular restaurant in the current iteration filteredRestaurantsArray() function's returned array.
        - If the add review button is clicked a modal window will appear with a form to add a review for the restaurant the add review button was a part of.  The restaurantToBeAdded state will be updated to the current iteration of the restaurant in the filteredRestaurantsArray() array.  Also a condition will determine if a review to the restaurant has been added and if so the user will be alerted they are not able to add multiple reviews to one restaurant.  The modal window opens by setting the css display value using JS from none to block for the modal window div.
        - If the modal window add review button is clicked and either one or both of the form fields have no text or selection then an alert stating both form fields need to be completed will appear.
        - If the modal window add review button is clicked and both form fields are completed and a restaurant has a rating of two then the rating for that review will become the overall rating since there will only be one rating for an added restaurant. This is achieved by updating the rating property of the added restaurant which had a review added from zero to the rating given by the user.
        - If the modal window add review button is clicked and both form fields are completed then filter will recieve the updated array including the newly added overall rating for the added restaurant.
        - If the modal window add review button is clicked and both form fields are completed then the new review will be added into one array in combination with the existing restaurant's reviews.  The updated restaurant's review array will then be added to any existing restaurant's reviews which have had one restaurant review added.  The combined array of all the restaurants reviews which have had one review added will be set as the state for newReviewsToAdd and additonally passed to the map component as the arguement in the function reviewToAddMap().
        - Upon the closing of the modal window css is manipulated using JS directly to have the modal window display change to none.  Also, the addedStarRating state is set to zero when the modal window is closed or the modal window add review button is clicked so when the modal window reopens the stars appear at zero.   
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

//RestaurantList module is exported to the Restaurants module
export default RestaurantList;
