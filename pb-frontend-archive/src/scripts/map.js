// PLEASE SEE VIEWDATA.JS FOR THE MAP FUNCTIONS
// WE ARE HAVING TROUBLES CALLING FUNCTIONS FROM DIFFERENT JS FILES, SO EVERYTHING IS IN THERE FOR THE TIME BEING

// old map:

// require([
//   "esri/Map",
//   "esri/views/MapView"
// ],
// function(Map, MapView) {
//   // Code to create the map and view will go here
//   var map = new Map({
//     basemap: "streets"
//   });
//   var view = new MapView({
//     container: "viewDiv",  // Reference to the DOM node that will contain the view
//     map: map,              // References the map object created in step 3
//     zoom: 5.5,  // Sets zoom level based on level of detail (LOD)
//     center: [-84.3880, 33.7490]  // Sets center point of view using longitude,latitude
//   });
// });
