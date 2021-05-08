import React, {Component} from "react";
// import PropTypes from "prop-types";
import Map from "./Map";
import Restaurants from "./Restaurants";

class Main extends Component {

    state = {
        filteredRestaurants: [],
        showAllRestaurants: true,
        addedRestaurantInfo: [],
        reviewToAddMap: []
    }

    filterRestaurants = (rating, totalRestaurantArray, bool) => {
        // const totalRestaurantArray = [...totalRestArray, ...this.state.addedRestaurantInfo];
        console.log(totalRestaurantArray);
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
                alert("There are no restaurants with the chosen rating. Please choose a different rating.")
            }
        }
        if ( rating === 3 ) {
            const filteredRestArray = totalRestaurantArray.filter( restaurant => Math.round(restaurant.rating) === 3 );
            this.setState( { filteredRestaurants: filteredRestArray } );
            if ( filteredRestArray.length === 0 ) {
                alert("There are no restaurants with the chosen rating. Please choose a different rating.")
            }
        }
        if ( rating === 4 ) {
            const filteredRestArray = totalRestaurantArray.filter( restaurant => Math.round(restaurant.rating) === 4 );
            this.setState( { filteredRestaurants: filteredRestArray } );
            if ( filteredRestArray.length === 0 ) {
                alert("There are no restaurants with the chosen rating. Please choose a different rating.")
            }
        }
        if ( rating === 5 ) {
            const filteredRestArray = totalRestaurantArray.filter( restaurant => Math.round(restaurant.rating) === 5 );
            this.setState( { filteredRestaurants: filteredRestArray } );
            if ( filteredRestArray.length === 0 ) {
                alert("There are no restaurants with the chosen rating. Please choose a different rating.")
            }
        }
    }

    addedRestInfo = (addRestInfo) => this.setState( { addedRestaurantInfo: addRestInfo } );
    
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

export default Main;
