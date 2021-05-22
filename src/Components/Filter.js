import React, {Component} from "react";
import PropTypes from "prop-types";
import star from "../img/star.svg";

class Filter extends Component {

    state = {
        starNumber: 0
    }

    render() {

        /* starHighlight()
        - ARGUEMENT - starPosition - starPosition represents the position of a star in the 5 star rating grouping.
        - RESPONSE - If the position of the star is less than or equal to the star clicked then the star will be given the CSS class to make the star appear yellow and thus make the star a part of the rating of the star.
        */
        this.starHighlight = (starPosition) => {
            if ( starPosition <= this.state.starNumber ) {
                return "yellowStar";
            } else {
                return "";
            }
        }

        // Every time an image is clicked the filterRestaurants() function from the Main module is called with the arguements of the rating, totalRestaurantArray() including any added restaurants, and a boolean value of false.
        // The showAllRestaurants boolean value of false is used in the Map and RestaurantList in the condition which decides which array to render which will either render all the restaurants or an array of filtered restaurants. 
        // When the "Show All Restaurants" button is clicked filterRestaurants recieves a rating of 0 and boolean value of true to indicate no rating was selected and since the boolean value for showing all restaurants is true the condition to use the array in the Map and RestaurantList which includes every restaurants will pass causing all restaurants to appear in the RestaurantList module and on the Map module.
        // Also, when the "Show All Restaurants" button is clicked the starPosition is set to zero causing all stars to appear unhighlighted and blank since the filter is not being used.
        return (
            <div className="filter">
                <h2>Filter Restaurants</h2>
                <div className="alert alert-info" role="alert">
                    Filter based on a Restaurant<span>&apos;</span>s star rating 
                </div>
                <div>
                    <img src={star} alt="star" className={ this.starHighlight(1) } onClick={ () => {
                            this.props.filterRestaurants(1, this.props.totalRestaurantArray, false); 
                            this.setState( { starNumber: 1 } );
                        } 
                    } />
                    <img src={star} alt="star" className={ this.starHighlight(2) } onClick={ () => {
                            this.props.filterRestaurants(2, this.props.totalRestaurantArray, false);
                            this.setState( { starNumber: 2 } );
                        }
                    } />
                    <img src={star} alt="star" className={ this.starHighlight(3) } onClick={ () => {
                            this.props.filterRestaurants(3, this.props.totalRestaurantArray, false);
                            this.setState( { starNumber: 3 } );
                        }
                    } />
                    <img src={star} alt="star" className={ this.starHighlight(4) } onClick={ () => {
                            this.props.filterRestaurants(4, this.props.totalRestaurantArray, false);
                            this.setState( { starNumber: 4 } );
                        }
                    } />
                    <img src={star} alt="star" className={ this.starHighlight(5) } onClick={ () => {
                            this.props.filterRestaurants(5, this.props.totalRestaurantArray, false);
                            this.setState( { starNumber: 5 } );
                        }
                    } />
                </div>
                <button className="btn btn-primary" onClick={() => {
                        this.props.filterRestaurants(0, this.props.totalRestaurantArray, true);
                        this.setState( { starNumber: 0 } );
                    }
                } >Show All Restaurants</button>
            </div>
        );
    }
}

Filter.propTypes = {
    rating: PropTypes.func
};

// The Filter module is exported for inclusion in the Main module.
export default Filter;