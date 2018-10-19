require([
  "esri/Map",
  "esri/views/MapView"
],
function(Map, MapView) {
  // Code to create the map and view will go here
  var map = new Map({
    basemap: "streets"
  });
  var view = new MapView({
    container: "viewDiv",  // Reference to the DOM node that will contain the view
    map: map,              // References the map object created in step 3
    zoom: 4,  // Sets zoom level based on level of detail (LOD)
    center: [15, 65]  // Sets center point of view using longitude,latitude
  });
});
