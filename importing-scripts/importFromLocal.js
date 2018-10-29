/*
 * Reads data from a local file. For use in testing.
 * Right now it just logs data in the console.
 */

var pathName = 'historical_data.json';
getDataFromLocal(pathName);

//Source: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML
function getDataFromLocal(url) {
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
