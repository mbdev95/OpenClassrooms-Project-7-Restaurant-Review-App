import React from "react";
// import PropTypes from "prop-types";
import Filter from "./Filter.js";
import RestaurantList from "./RestaurantList.js";

const Restaurants = (props) => {

    // const {

    // } = props
    return (
        <div className="review col-md-4">
            <Filter />
            <RestaurantList />
        </div>
    );
}

// Restaurants.propTypes = {

// };

export default Restaurants;