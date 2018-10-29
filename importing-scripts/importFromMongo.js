/*
 * Pulls data from remote server.
 * Right now, uses a temporary url and just logs data in the console.
 * TODO: Connect to MongoDB server and do something w data.
 */

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
getDataFromMongo(url);

//Source: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML
function getDataFromMongo(url) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', url, true)
  xhr.responseType = 'json';
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.response);
      }
    }
  };
  xhr.send();
};
