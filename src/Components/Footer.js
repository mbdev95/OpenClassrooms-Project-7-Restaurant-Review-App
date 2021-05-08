import React from "react";
import star from "../img/star.svg";
import martini from "../img/martini.svg"
import misoSoup from "../img/miso-soup.svg";
import pizza from "../img/pizza.svg";
import spaghetti from "../img/spaghetti.svg";

const Footer = () => {

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

export default Footer;