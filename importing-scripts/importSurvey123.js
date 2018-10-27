/*
 * Pulls data from ArcGIS. Uses ArcGIS API for JavaScript v. 4.9.
 * Right now, uses a temporary url and just logs data in the console.
 * TODO: Connect to actual url and do something w data.
 */

var urlSample = "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Fire/Sheep/FeatureServer/2?f=pjson";
//above url is from https://www.e-education.psu.edu/geog865/node/255
//url in format https://<catalog-url>/<serviceName>/FeatureServer/f=json

//Load by default
getDataFromSurvey123(urlSample);

function getDataFromSurvey123(url) {
  //esriRequest api documentation https://developers.arcgis.com/javascript/latest/api-reference/esri-request.html
  require(["esri/request"], function(esriRequest) {
    // LIKE fetch(url, {
    // Request GeoJson data from USGS remote server and print to console
    esriRequest(url, {
      responseType: "json"
    }).then(function(response){
      console.log(response.data);
    });
  });
};
