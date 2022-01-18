// Application Module
import React, {Component} from 'react';
import Main from "./Main.js";
import Header from "./Header.js";
import Footer from "./Footer.js";

class App extends Component {
  
  window.addEventListener('load', () => alert('Please note the Google Places API used to obtain restaurant information is no longer active for security reasons.'));

  render() {

    // returns header, main - map / restaurants - filter / restaurantList
    return (
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

// export application module to index.js
export default App;
