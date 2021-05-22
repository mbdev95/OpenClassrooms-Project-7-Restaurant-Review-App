//Main module
import React, {Component} from "react";
import Map from "./Map";
import Restaurants from "./Restaurants";

class Main extends Component {

    state = {
        filteredRestaurants: [],
        showAllRestaurants: true,
        addedRestaurantInfo: [],
        reviewToAddMap: []
    }

    /*
    filterRestaurants()
    - ARGUEMENT - rating - A number value based off of the clicked star's position in the set of 5 stars used to rate each restaurant.
    - ARGUEMENT - totalRestaurantArray - An array of all the restaurants in the restaurant list including any added restaurants.  
        -This value is lifted from the restaurant list module to the restaurants module, and finally passed down to the filter module as props to be used as this arguement for the filterRestaurants() function.
    - ARGUEMENT - bool - a value altered to false if the filter is used.  
        -The value is set as state in the Main module and passed down to the Map module as props.
        -In the Map module the boolean value is used in a condition to determine if the array of restaurant given to the map to display the markers and infowindow will be the array from this restaurantFilters method or simply the totalRestaurantList array defined in the map Module.
    - RESULT - The totalRestaurantArray is filtered to show only restaurants with the specified rating and the resulting array is set to state in the Main module to represent all the filtered restaurants.
        -This new array becomes the array used in the Map module and RestaurantList module to represent the restaurants which have been filtered based on a specified rating.  This array is then used in the RestaurantList and Map modules as the array to display each restaurants information instead of the totalRestarauntList array composed within each own's module if the filter was used.
        -If the rating selected does not match the overall rating of any restaurants in the totalRestaurantArray then an alert appears indicating no restaurants in the users area have the selected rating.
    */
    filterRestaurants = (rating, totalRestaurantArray, bool) => {
        this.setState( { showAllRestaurants: bool } );
        if ( rating === 1 ) {
            const filteredRestArray = totalRestaurantArray.filter( restaurant => Math.round(restaurant.rating) === 1 );
            this.setState( { filteredRestaurants: filteredRestArray } );
            if ( filteredRestArray.length === 0 ) {
                alert("There are no restaurants with the chosen rating. Please choose a different rating.");
            } 
        }
        if ( rating === 2 ) {
            const filteredRestArray = totalRestaurantArray.filter( restaurant => Math.round(restaurant.rating) === 2 );
            this.setState( { filteredRestaurants: filteredRestArray } );
            if ( filteredRestArray.length === 0 ) {
                alert("There are no restaurants with the chosen rating. Please choose a different rating.");
            }
        }
        if ( rating === 3 ) {
            const filteredRestArray = totalRestaurantArray.filter( restaurant => Math.round(restaurant.rating) === 3 );
            this.setState( { filteredRestaurants: filteredRestArray } );
            if ( filteredRestArray.length === 0 ) {
                alert("There are no restaurants with the chosen rating. Please choose a different rating.");
            }
        }
        if ( rating === 4 ) {
            const filteredRestArray = totalRestaurantArray.filter( restaurant => Math.round(restaurant.rating) === 4 );
            this.setState( { filteredRestaurants: filteredRestArray } );
            if ( filteredRestArray.length === 0 ) {
                alert("There are no restaurants with the chosen rating. Please choose a different rating.");
            }
        }
        if ( rating === 5 ) {
            const filteredRestArray = totalRestaurantArray.filter( restaurant => Math.round(restaurant.rating) === 5 );
            this.setState( { filteredRestaurants: filteredRestArray } );
            if ( filteredRestArray.length === 0 ) {
                alert("There are no restaurants with the chosen rating. Please choose a different rating.");
            }
        }
    }

    /* 
    addedRestInfo()
    - ARGUEMENT - addRestInfo - An array containing an object with the information of a restaurant given from the add restaurant form in the Map module.
    - RESULT - The Main module's addedRestaurantInfo's state is updated with the newly added restaurant's info.
        -The addedRestaurantInfo's state is then passed down the RestaurantList module as props and added to the totalRestaurantList.
    */
    addedRestInfo = (addRestInfo) => this.setState( { addedRestaurantInfo: addRestInfo } );
    
    /* 
    reviewToAddMap()
    - Arguement - review - An array containing the previous reviews object and the newly added review object together in one array taken from the RestaurantList Module.
    - Result - The Main modules state's property of reviewToAddMap is added and this value is passed down to the map.
        -The reviewToAddMap is used in a condition to determine a boolean value based on if there is a new review to be added and if true then the reviewToAddMap array is used instead of the reviews generated by the api request from within the Map module itself.
    */
    reviewToAddMap = (review) => this.setState( { reviewToAddMap: review } );

    render() {
        return (
            <div className="main">
                <div className="row no-gutters">
                    <Map restaurants={this.state.filteredRestaurants} showAllRestaurants={this.state.showAllRestaurants} addedRestInfo={this.addedRestInfo} reviewToAddMap={this.state.reviewToAddMap} />
                    <Restaurants filterRestaurants={this.filterRestaurants} restaurants={this.state.filteredRestaurants} showAllRestaurants={this.state.showAllRestaurants} addedRestInfo={this.state.addedRestaurantInfo} reviewToAddMap={this.reviewToAddMap} />
                </div>
            </div>
        );

    }
}

// export main to be a child element of the App module
export default Main;
