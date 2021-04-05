import React from "react";
// import PropTypes from "prop-types";
import Map from "./Map";
import Restaurants from "./Restaurants";

const Main = () => {

    // const {

    // } = props

    return (
        <div className="main">
            <div className="row no-gutters">
                <Map />
                <Restaurants />
            </div>
        </div>
    );
}

// Main.propTypes = {

// }

export default Main;