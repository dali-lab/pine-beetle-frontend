import '../styles/index.css';
import '../styles/default.css';
import '../styles/about.css';
import '../styles/viewdata.css';

import './default.js';
import './map.js';
import './viewdata.js';

import '../images/dali.png';
import '../images/dali_blue_green.png';
import '../images/dali_dark.png';
import '../images/dartmouth.png';
import '../images/future_des_1.png';
import '../images/future_des_2.png';
import '../images/sample_img_1.jpeg';
import '../images/sample_img_2.jpg';
import '../images/sample_img_3.jpeg';
import '../images/usfs.png';

var selection = "us";

// show nation-wide predictions on home page

var totalData = [{"_id":"5bcb7928763d69464cb8d23e","yearNumber":1,"state":"AL","nf":"BANKHEAD","classification":"RD","forest":"BANKHEAD RD","stateCode":1,"forestCode":1,"latitude":34.23306,"longitude":-87.31112,"host":20.68,"year":1986,"spbPerTwoWeeks":null,"cleridsPerTwoWeeks":null,"spots":564,"spotsPerHundredKm":273,"percentSpb":null,"__v":0,"id":"5bcb7928763d69464cb8d23e"},{"_id":"5bcb7928763d69464cb8d23f","yearNumber":2,"state":"AL","nf":"test","classification":"RD","forest":"BANKHEAD RD","stateCode":1,"forestCode":1,"latitude":34.23306,"longitude":-87.31112,"host":20.68,"year":1987,"spbPerTwoWeeks":931,"cleridsPerTwoWeeks":210,"spots":600,"spotsPerHundredKm":290,"percentSpb":null,"__v":0,"id":"5bcb7928763d69464cb8d23f"},{"_id":"5bcb792b763d69464cb8deb5","yearNumber":23,"state":"SC","nf":"","classification":"CO","forest":"Lexington Co.","stateCode":null,"forestCode":null,"latitude":null,"longitude":null,"host":null,"year":2008,"spbPerTwoWeeks":1,"cleridsPerTwoWeeks":8,"spots":65,"spotsPerHundredKm":null,"percentSpb":14,"__v":0,"id":"5bcb792b763d69464cb8deb5"},{"_id":"5bcb792b763d69464cb8dc75","yearNumber":1,"state":"SC","nf":"SUMTER","classification":"RD","forest":"ENOREE RD","stateCode":12,"forestCode":1,"latitude":34.52179,"longitude":-81.62842,"host":18.23,"year":1986,"spbPerTwoWeeks":null,"cleridsPerTwoWeeks":null,"spots":null,"spotsPerHundredKm":null,"percentSpb":null,"__v":0,"id":"5bcb792b763d69464cb8dc75"}];

// source: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML
function getDataFromLocal(url) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', url, true)
  xhr.responseType = 'json';
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
          totalData = [{"_id":"5bcb7928763d69464cb8d23e","yearNumber":1,"state":"AL","nf":"BANKHEAD","classification":"RD","forest":"BANKHEAD RD","stateCode":1,"forestCode":1,"latitude":34.23306,"longitude":-87.31112,"host":20.68,"year":1986,"spbPerTwoWeeks":null,"cleridsPerTwoWeeks":null,"spots":564,"spotsPerHundredKm":273,"percentSpb":null,"__v":0,"id":"5bcb7928763d69464cb8d23e"}];
      }
    }
  };
  xhr.send();
};
