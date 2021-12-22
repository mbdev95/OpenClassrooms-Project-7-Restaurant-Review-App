import React from "react";
import forkKnife from "../img/fork-and-knife.svg"

const Header = () => {

    return (

        <header className="d-flex justify-content-around">
            <div>
                <img src={forkKnife} alt="fork and knife" />
                <img src={forkKnife} alt="fork and knife" />
                <img src={forkKnife} alt="fork and knife" />
            </div>
            <h1>Restaurant Review Locator</h1>
            <div>
                <img src={forkKnife} alt="fork and knife" />
                <img src={forkKnife} alt="fork and knife" />
                <img src={forkKnife} alt="fork and knife" />
            </div>
        </header>
    );
}

// Export Header module to App module.
export default Header;
