import React, {Component} from 'react';
import Main from "./Main.js";
import Header from "./Header.js";
import Footer from "./Footer.js";

class App extends Component {

  render() {

    return (
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;
