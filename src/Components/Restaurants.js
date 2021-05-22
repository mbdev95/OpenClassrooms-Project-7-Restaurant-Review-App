import React, {Component} from "react";
import PropTypes from "prop-types";
import Filter from "./Filter.js";
import RestaurantList from "./RestaurantList.js";

class Restaurants extends Component {

    state = {
        restArray: []
    }

    /* totalRestaurantArray()
    - ARGUEMENT - The total restaurant array of all the restaurants in the restaurant list.
    - RESULT - The restArray state will become the arguement array of all the restaurants from the restaurantList. This state will be passed down to the filter and then used as the array which is filtered through.  The array which is filtered thus will include any added restaurants since the array is coming from the restaurantList where added restaurants are added to the total restaurant list array.
    */
    totalRestaurantArray = (ra) => {
        this.setState( { restArray: ra } );
    }

    render() {

        return (
            <div className="review col-md-4">
                <Filter filterRestaurants={this.props.filterRestaurants} totalRestaurantArray={this.state.restArray} />
                <RestaurantList restArray={this.totalRestaurantArray} restaurants={this.props.restaurants} showAllRestaurants={this.props.showAllRestaurants} addedRestInfo={this.props.addedRestInfo} reviewToAddMap={this.props.reviewToAddMap} />
            </div>
        );

    }

}

Restaurants.propTypes = {
    filterRestaurants: PropTypes.func,
    restaurants: PropTypes.array,
    showAllRestaurants: PropTypes.bool,
    addedRestInfo: PropTypes.array,
    reviewToAddMap: PropTypes.func
};

// The Restaurants module is exported to be a part of the Main module.
export default Restaurants;

