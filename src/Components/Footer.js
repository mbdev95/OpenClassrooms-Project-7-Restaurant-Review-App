import React from "react";
import star from "../img/star.svg";
import martini from "../img/martini.svg"
import misoSoup from "../img/miso-soup.svg";
import pizza from "../img/pizza.svg";
import spaghetti from "../img/spaghetti.svg";
// import PropTypes from "prop-types";

const Footer = (props) => {

    // const {

    // } = props

    return (
        <footer>
            <p><span>&copy;</span> Restaurant Review Finder</p>
            <div>
                <img src={star} alt="star" />
                <img src={martini} alt="martini" className="foodSvg" />
                <img src={star} alt="star" />
                <img src={misoSoup} alt="miso-soup" className="foodSvg" /> 
                <img src={star} alt="star" /> 
                <img src={pizza} alt="pizza" className="foodSvg" />
                <img src={star} alt="star" />
                <img src={spaghetti} alt="spaghetti" className="foodSvg" />
                <img src={star} alt="star" />
            </div>
            <p>Website By Mark Bucholski</p>
        </footer>
    );
}

// Footer.propTypes = {

// };

export default Footer;