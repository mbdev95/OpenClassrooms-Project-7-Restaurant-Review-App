import React from "react";
// import PropTypes from "prop-types";
import forkKnife from "../img/fork-and-knife.svg"

const Header = (props) => {

    // const {
    //     headerText
    // } = props

    return (

        <header className="d-flex justify-content-around">
            <div>
                <img src={forkKnife} alt="fork and knife" />
                <img src={forkKnife} alt="fork and knife" />
                <img src={forkKnife} alt="fork and knife" />
            </div>
            <h1>Restaurant Review Finder</h1>
            <div>
                <img src={forkKnife} alt="fork and knife" />
                <img src={forkKnife} alt="fork and knife" />
                <img src={forkKnife} alt="fork and knife" />
            </div>
        </header>
    );
}

// Header.propTypes = {

// };

export default Header;