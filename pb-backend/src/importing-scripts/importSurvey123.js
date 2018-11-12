/*
 * Madeline Hess 11.3.2018
 * Pulls data from ArcGIS. Uses ArcGIS API for JavaScript v. 4.9.
 * Just logs data in the console, but can be implemented to do cooler things.
 * TODO: Do something w data.
 */
// import controller from '../pb-backend/src/controllers/survey123_controller.js';
const controller = require('../pb-backend/src/controllers/survey123_controller.js');
// import * as controller from '../pb-backend/src/controllers/survey123_controller.js';
var urlSample = "https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_765fc8be50884d29b37ee120d68ea6de/FeatureServer/0/query?where=1=1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=Vu9Bl12svq_wPtrqq4g9kMoAWLRTo4pflWh2IoAaOwqZsg4VngH9wGifWLQG318zY9YNjJNISwWVsuiIuw7dTKO63_9qP2Skt6gqXZaLFonTqV1SkrMwYHk1Wv1TTC5ZvlgACKMsUZCE_fAOpHSgfSVQSW0ZQDtzw3gwv0D8UqXGAMaHWN71qPAM7bTGAZa_DA8f2lpY9rA6P8WZBkp_ZIGno7YJh6Ry_n8amM2sFVk.";
//Use url in format https://<catalog-url>/<serviceName>/FeatureServer/f=json
//ex. "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/[INSERT INFO HERE]/FeatureServer/2?f=pjson";

//Load data
getDataFromSurvey123(urlSample);

function getDataFromSurvey123(url) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', url, true)
  xhr.responseType = 'json';
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.response);  //code goes here!
      }
    }
  };
  xhr.send();
};