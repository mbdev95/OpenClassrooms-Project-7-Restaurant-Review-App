import React, {Component} from "react";
import PropTypes from "prop-types";
import Filter from "./Filter.js";
import RestaurantList from "./RestaurantList.js";
import { render } from "@testing-library/react";

class Restaurants extends Component {

    state = {
        restArray: []
    }

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

export default Restaurants;

