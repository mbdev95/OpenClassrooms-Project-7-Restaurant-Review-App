# Restaurant Review Locator

## Introduction
For my seventh project of the OpenClassrooms Front-End developer course I created a restaurant review locator app using React, CSS and REST APIs. The goals of the project were to use enhance my previous experience with object-oriented JavaScript from Project 6 to create an application with react.  Secondarily, another goal was to learn how to import data using REST APIs, and then render the imported data to the page depending on events instantiated by the user.  This project taught me the importance of using Javascript libraries and REST APIs to increase the capablities of the functionality of my apps. 

### Click the link below to go see the app online:

*** The restaurant review locator accessible below has no api keys for security reasons. Only the design of the App is visible since the api's required to generate the restaurants will not be operating.

https://mbdev95.github.io/OpenClassrooms-Project-7-Restaurant-Review-App/

## User-Interface
![Restaurant-Review-Finder-User-Interface](https://user-images.githubusercontent.com/77469447/128112031-ee9e2188-d676-4cef-b2ea-d829617f0747.PNG)

The user-interface was all rendered within the various components of the react element.  Each component returns JSX, reacts version of html, which is then rendered to the DOM via the index.js file.  The interface created starts with a parent component, which then holds the JSX of child components, and further child components.  In my app the parent component called App holds the JSX from the Header, Footer, and Main components.  The main component contains the Map and Restaurants components.  The Restaurants component holds the JSX from the Filter and RestaurantList components. React structures my application from the top down with one main component holding various other descendents, with each descendents specificity of function increasing.   Therefore, react renders my user-interface in an organized and compartmentalized way, where each area of similar functionality is separated in a component, giving the user-interface an organized look while also allowing for a seamless data flow within the different areas of similar functionality.

## Using React
![Add-Review-Form](https://user-images.githubusercontent.com/77469447/128111719-009da3f8-1a60-4c46-a5a3-bc397bed9aba.PNG)

I will now discuss how I used react to create an organized flow of data in my application. React communicates via props and callback functions.  Props are variables React recognizes as passing down information from a centralized component to child components.  Callback functions are functions called in a descendant component which carry data up to a centralized component.  In my app the Main component is the centralized controller of information. In the above image an add review form modal window pops up when an "Add Review" button is clicked allowing a user to add a review. When the "Add Review" button is clicked on the modal window a callback function is called triggering a function to show the modal window in the map component.  The callback function is initially passed from the RestaurantList component to the Main component via a callback which contains the review passed as an argument. In the Main component the callback function will trigger the state of addedRestaurantInfo to be updated with the argument from the callback triggered in the RestaurantList component. This will triggger props to be passed down to the Map component containing the new state for addedrestaurantInfo. The value of the props passed down to the Map Component, the review added in the RestaurantList component, is then rendered to the infowindow for the restaurant on the map which had the review added. In the image below you can see the last review for the restaurant was just added via the form from the RestaurantList component viewed in the above image. Thus, react provides an effective way to communicate data from a centralized component to descendant components via props, and from descendent components to centralized components via callback functions.

![Added-Review-On-Infowindow](https://user-images.githubusercontent.com/77469447/128111751-ab3a4764-2d84-400e-8742-d40be7c4ddda.PNG)



## Using Google Maps APIs
![User-Location](https://user-images.githubusercontent.com/77469447/128111516-62ea14d7-7266-4052-8870-133fbb51f0a2.PNG)

I used Google Map's APIs to obtain data pertaining the restaurants within a given area.  The data obtained included names, addresses, reviews,  gps coordinates and ratings.  The gps coordinates were used to render blue markers at the location of each restaurant.  When the blue markers are clicked on an infowindow appears which displays many of the other data returned from the api get requests to google.  Moreover, in the RestaurantList each restaurant's information is also populated with data from a Google Maps API get request.  The API requests return an array which I iterated through and rendered the data to the DOM.   The above image shows the user location, which was found using the browser built-in geolocation property, and the location of restaurants determined by the gps coordinates returned from an API get request to Google Maps.  In the first image on the page, the user-interface image you can see the RestaurantList on the right side, and an infowindow, which all contain information obtain via Google Maps API, the Google Places API specifically.   Finally, the image below shows an add restaurant form which appears when a user clicks on the map.  The location the infowindow appears is based on Google Map's click event latlng property.  I was able to use Google Maps' APIs to successfully obtain the information required to show each restaurant's information accurately.

![Add-New-Restaurant-Form](https://user-images.githubusercontent.com/77469447/128225497-b5977afb-805b-46e8-8bbb-a5e63bb48c6e.PNG)

## Conclusion

