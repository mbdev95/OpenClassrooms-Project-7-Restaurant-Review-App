import React from "react";
import PropTypes from "prop-types";
import {GoogleMap, Marker, useJsApiLoader, InfoWindow} from '@react-google-maps/api';
import axios from 'axios';
import star from "../img/star.svg";
 
const Map = (props) => {

    const {
        restaurants,
        showAllRestaurants,
        addedRestInfo,
        reviewToAddMap
    } = props

    // Loads the google maps JS Api after html and css has loaded to ensure the user views a web page before loading the api.
    const { isLoaded } = useJsApiLoader({
       id: 'restaurant-locator-308917',
       googleMapsApiKey: "key"
    })

    // The map height and width is set to 100% of it's parent's height and width.
    const containerStyle = {
        height: "100%",
        width: "100%"
    };

    // A function to deal with error resulting from a browser not having location permissions enabled.
    const error = () => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(res => {
                if (res.state === 'denied') {
                alert('Enable location permissions for this website in your browser settings.')
                }
            })
        }
    }

    //Using state to hold the user's location, and if geolocation is not supported an alert appears informing the user.
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

    // The state of the totalRestaurantList used to hold all the restaurant's information in objects is initialized to an empty array.
    const [totalRestaurantList, setTotalRestaurantList] = React.useState([]);
    
    // The useEffect react hook is used to load each restaurant as an object with information obtained from the google maps API, and subsequently the google places api upon page load once the google map has mounted for the first time.  
    // The useEffect hook only runs once due to the empty dependency array.
    React.useEffect( () => 

        {
    /* combinedRestaurantArrays()
    - Arguement - googlePlacesRestaurants - An array of restaurant's obejcts loaded from the googlePlacesApi which is loaded using the restaurants googlePlaces id loaded from the google maps Api.
    - Results - The googlePlacesRestaurants array is maped through returning an array of objects to the refinedGoogleRestaurants variable, and contains all the required information for the restaurant's marker's location and the restaurant's infowindow.
        - The address is formed by taking the minimum address length and then concacting the remainder of the address components on the basis of the number of address components remaining.
        - The JSON restaurants and google api restaurants are combined into one array using the spread operator.  The resulting array then becomes the state for totalRestaurantList.
    */
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
                setTotalRestaurantList(refinedGoogleRestaurants);
            };

    /* handleRestaurantSearch()
        - RESULT - The combinedRestaurantArray() function is called with an array of objects containing each restaurants required information is passed through as the arguement.
            -Immediantly after this function declaration the handleRestaurantSearch() function is called inorder to have the function executed once upon the first rendering of the map component.
    */
            const handleRestaurantSearch = () => {

    //A function to deal with error resulting from a browser not having location permissions enabled.
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
    //  The arrayRest has the length of the initial array from google maps api then the array rest has all the restaurants information and thus this array is passed to combinedRestaurantArrays so this array can be used to ultimately update the totalRestaurantList.
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
                        const key = `&key=key`;
                        const restaurantSearchUrl = url + location + radius + type + key;
                        axios.get("https://secret-ocean-49799.herokuapp.com/" + restaurantSearchUrl)
                        .then(response => {  
                            const arrayRest = [];                              
                            response.data.results.forEach( restaurant => {
                                const url = `https://maps.googleapis.com/maps/api/place/details/json?`;
                                const place_id = `place_id=${restaurant.place_id}`;
                                const fields = `&fields=name,address_component,geometry,rating,reviews`;
                                const language =`&language=en`;
                                const key = `&key=key`;
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

    /* filteredRestaurantsArray()
    - RESULT - The information for the restaurant markers to be displayed on the map and their respective infowindows are returned based on a series of condition.
        - Condition 1 determines if the filter has been used, and if the rating selected matches the rating of any restaurants. If true the restaurants which have the same rating as the rating selected will be returned.
        - Also after condition 1 is true a further if else statement will determine if the restaurant was newly added or not and if newly added the location is given by the click event position property as opposed to the lat/lng properties for restaurants originally taken from the google maps api.
        - Condition 2 determines if the filter has been used, and will only be true if the rating selected yields no restaurants, thus returning an empty array.
        - Condition 3 determines if the filter has been used, and will only be true if the filter was not used returning all the restaurants.
    */
    const filteredRestaurantsArray = () => {
        if ( restaurants.length > 0 && showAllRestaurants === false ) {
            const refinedGoogleRestaurants = restaurants.map( (restaurant) =>
                { 
                    if ( restaurant.newlyAddedRest ) {
                        return (
                          {
                            name: restaurant.name,
                            address: restaurant.address,
                            position: restaurant.position,
                            rating: restaurant.rating,
                            reviews: restaurant.reviews,
                            newlyAddedRest: true
                          }  
                        )
                    } else {
                        return (
                            {
                                name: restaurant.name,
                                address: restaurant.address,
                                lat: restaurant.lat,
                                long: restaurant.long,
                                rating: restaurant.rating,
                                reviews: restaurant.reviews,
                                newlyAddedRest: false
                                
                            }
                        )
                    } 
                }
            );
            return refinedGoogleRestaurants
        } else if ( restaurants.length === 0 && showAllRestaurants === false ) {
            return [];
        } else if ( showAllRestaurants === true ) {
            return totalRestaurantList;
        }
    }

    // The map state is set to null originally.
    const [map, setMap] = React.useState(null)
  
    // On page load the map state is set to the map arguement passed in through the callback.
    const onLoad = React.useCallback(function callback() {  
       setMap(map)
    }, [])

    // When the map unmounts the map state returns to null.
    const onUnmount = React.useCallback(function callback(map) {
       setMap(null)
    }, [])

    // State to display the information for each restaurant's marker clicked on which pertains to the iteration of that restaurant from the filteredRestaurantsArray() returned array value.
    const [displayRestInfo, setDisplayRestInfo] = React.useState(null);

    // State to hold the url needed to access the google street photo of the restaurant's marker which was clicked on.
    const [displayRestPhoto, setDisplayRestPhoto] = React.useState("");

    /* starHighlight()
    - ARGUEMENT - starPosition - the position of the star in the grouping of 5 stars in the restaurant's infowindow.
    - RESULT - If the starPostion is less than or equal to the rating of the restaurant clicked on the star image is given the class of "yellowStar" and thus colored yellow, otherwise the star image will appear uncoloured.
    */
    const starHighlight = (starPosition) => {
        if ( starPosition <= Math.round(displayRestInfo.rating) ) {
            return "yellowStar";
        } else {
            return "";
        }
    }

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

    /* addedRestInfoForMap()
    - ARGUEMENT - mapAddedRestInfo - The newly added restaurant's information object with name and address info obtained from the form field's values and the result of the location function below.
    - RESULT - The new restaurant's object is concated with the totalRestaurantList into one new totalRestaurantList array. The new array is returned as the value for the totalRestaurantList state.
    */
    const addedRestInfoForMap = mapAddedRestInfo => {
        const updatedMapRest = totalRestaurantList.concat(mapAddedRestInfo);
        setTotalRestaurantList(updatedMapRest);
    }

    // The addRestaurantForm state is initialized to null and will cause a form infowindow to appear upon a map click.
    const [addRestaurantForm, setAddRestaurantForm] = React.useState(null);

    /* location()
    - ARGUEMENT - restaurant - The restaurant information object pertaining to the marker that was clicked on.
    - RESULT - The location object is returned with lat and long as a position property if the restaurant was newly added by the user using the form since newly added restaurants have a position object based on where the click occured to add the newly added restaurant. Otherwise if the restaurant is originally loaded by the api the lat and lng found in the restaurant's information object are used to give the location of the marker. 
    */
    const location = (restaurant) => {
        let location;
        restaurant.newlyAddedRest ? location = restaurant.position : 
        location = {
            lat: parseFloat(restaurant.lat),
            lng: parseFloat(restaurant.long)
        }
        return location; 
    }

    /* restaurantReviews()
    - ARGUEMENT - restaurant - The restaurant information object pertaining to the marker that was clicked on.
    - RESULT - The reviewToAddMap prop contains any newly added reviews plus any other existing reviews from the restaurant which had a review added by the user.
        - The reviewToAddMap is filtered on the basis of the restaurant whose marker was clicked on's name and the name of the restaurant which has had a review added being the same. If the same then all the reviews from the restaurant with added review will be placed in the reviewsToAddToCurrentRestaurant variable.
        - If reviews were added to the restaurant being iterated through then the reviewsToAddToCurrentRestaurant array is returned and the reviews including the review added by the user are rendered to the restaurant's infowindow.
        - If no reviews were added to the restaurant being iterated through then the restaurant's original reviews are returned without any additional reviews.
    */
    const restaurantReviews = (restaurant) => {
        const reviewsToAddToCurrentRestaurant = reviewToAddMap.filter(review => restaurant.name === review.restName);
        if ( reviewsToAddToCurrentRestaurant.length > 0 ) {
            return reviewsToAddToCurrentRestaurant;
        } else {
            return restaurant.reviews;
        }
    }

    // If the page is loaded return the map module otherwise return an empty module.
    return isLoaded ? (
        <div className="col-md-8 map">
        {/* - If the click event is not undefined give the add restaurant form a location value based off of the click location which will trigger the add restaurant form infowindow to appear. */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={ position }
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={ event =>  
                    { 
                        setDisplayRestInfo(null);
                        setAddRestaurantForm(event.latLng);
                    }
                }
                onDrag={ () => 
                    {
                        setDisplayRestInfo(null);
                        setAddRestaurantForm(null);
                    }
                }
            >
    {/* - When the user's marker is clicked the restataurant's infowindow and add restaurant form window are closed. The position of the marker is found using the browser's geolocation.*/}
                <Marker 
                    position={ position } 
                    onClick={ () => {
                            setDisplayRestInfo(null);
                            setAddRestaurantForm(null);
                        }
                    }
                />

    {/* -The addRestaurantForm's location comes from the map click event position value stored in the addRestaurantForm state. 
    - The submit event default of page reload is prevented and an alert tells the user to fill in all form fields if any fields have zero text.
    - When the submit button is clicked, if all the form fields have text then an array with an object pertaining to the information of the restaurant to be added is created and set to be the state for addedRestInfoForMap and addedRestInfo which will upon a rerender cause both the map and restaurantList to be updated with the new restaurant.
    - The addRestaurantForm state will be set to null closing the add restaurant form window upon the submit button being clicked. */}
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

    {/* - The returned array from the filteredRestaurantsArray() function is iterated through using the map method.  
    - For each iteration a marker will appear on the map at the location specified by the location function's returned location value, either a lat lng or a click events position property depending on if the restaurant was added by the user or came from an api get request. 
    - A click event listener is added to each marker which when cliked will set displayRestInfo from null to the restaurant's information object of that iteration, and will generate an image of the restaurant of the current iteration to be used in the infowindow. Any current restaurant infowindows that are open will be closed by setting addRestaurantForm to null.
    - The marker icon attribute is given a url to make the marker blue to distinguish the marker from the user location's marker*/}
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
                                        const key = `&key=key`;
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
    {/* - The position comes from the return value of the location() function which will be either a lat lng or a click events position property depending on if the restaurant was added by the user or came from an api get request. 
    - The displayRestInfo is set to the restaurant's marker that was clicked on's restaurant's info object.  This state is then used to give the information needed for the restaurant's information in the display restaurant form.
    - The displayRestPhoto holds the url of the google street image for the marker's restaurant that was clicked on. 
    - The reviews displayed for the restaurant will either come from an array of reviews including the added review if the reviewToAddMap prop has a value and the value's restaurant name corresponds to the displayRestInfo's restaurant's name or else the restaurantReviews() function returns false then simply an array of the reviews from displayRestInfo will be iterated through and returned. */}
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
                                    restaurantReviews(displayRestInfo).map( (review, index) => 
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

// The Map component is exported to the Main component.
export default React.memo(Map);
