import React, {Component} from "react";
import PropTypes from "prop-types";
import star from "../img/star.svg";

class Filter extends Component {

    state = {
        starNumber: 0
    }

    render() {

        this.starHighlight = (starPosition) => {
            if ( starPosition <= this.state.starNumber ) {
                return "starHighlight";
            } else {
                return "";
            }
        }

        return (
            <div className="filter">
                <h2>Filter Restaurants</h2>
                <div className="alert alert-info" role="alert">
                    Filter based on a Restaurant<span>&apos;</span>s star rating
                </div>
                <div>
                    <img src={star} alt="star" className={ this.starHighlight(1) } onClick={ () => {
                            this.props.filterRestaurants(1, this.props.totalRestaurantArray); 
                            this.setState( { starNumber: 1 } );
                        } 
                    } />
                    <img src={star} alt="star" className={ this.starHighlight(2) } onClick={ () => {
                            this.props.filterRestaurants(2, this.props.totalRestaurantArray);
                            this.setState( { starNumber: 2 } );
                        }
                    } />
                    <img src={star} alt="star" className={ this.starHighlight(3) } onClick={ () => {
                            this.props.filterRestaurants(3, this.props.totalRestaurantArray);
                            this.setState( { starNumber: 3 } );
                        }
                    } />
                    <img src={star} alt="star" className={ this.starHighlight(4) } onClick={ () => {
                            this.props.filterRestaurants(4, this.props.totalRestaurantArray);
                            this.setState( { starNumber: 4 } );
                        }
                    } />
                    <img src={star} alt="star" className={ this.starHighlight(5) } onClick={ () => {
                            this.props.filterRestaurants(5, this.props.totalRestaurantArray);
                            this.setState( { starNumber: 5 } );
                        }
                    } />
                </div>
            </div>
        );
    }
}

Filter.propTypes = {
    rating: PropTypes.func
};

export default Filter;