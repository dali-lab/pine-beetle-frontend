var map, view, point, markerSymbol, pointAtt, pointGraphic;

require([
"esri/Map",
"esri/views/MapView",
"esri/Graphic"
], function(Map,MapView,Graphic) {

    // base layer map
    map = new Map({
      basemap: "streets"
    });

    // map view - holds graphics, points, etc.
    view = new MapView({
      center: [-84.3880, 33.7490],
      container: "viewDiv",
      map: map,
      zoom: 3
    });

    // First create a point geometry
    point = {
        type: "point",  // autocasts as new Point()
        longitude: -84.3880,
        latitude: 33.7490
    };

    // Create a symbol for drawing the point
    markerSymbol = {
        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
        color: [255, 0, 0]
    };

    // Create an object for storing attributes related to the point
    pointAtt = {
      Name: "Test Name",
      Owner: "Test Owner",
      Length: "Test Length"
    };

    /*******************************************
     * Create a new graphic and add the geometry,
     * symbol, and attributes to it. You may also
     * add a simple PopupTemplate to the graphic.
     * This allows users to view the graphic's
     * attributes when it is clicked.
     ******************************************/
    pointGraphic = new Graphic({
       geometry: point,
       symbol: markerSymbol,
       attributes: pointAtt,
       popupTemplate: {  // autocasts as new PopupTemplate()
         title: "{Name}",
         content: [{
           type: "fields",
           fieldInfos: [{
             fieldName: "Name"
           }, {
             fieldName: "Owner"
           }, {
             fieldName: "Length"
           }]
         }]
       }
     });

    // Add the point graphic to the view's GraphicsLayer
    view.graphics.add(pointGraphic);
});
