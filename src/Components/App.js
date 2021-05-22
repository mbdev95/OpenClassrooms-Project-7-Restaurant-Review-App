// Application Module
import React, {Component} from 'react';
import Main from "./Main.js";
import Header from "./Header.js";
import Footer from "./Footer.js";

class App extends Component {

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
