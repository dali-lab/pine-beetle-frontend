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

function changeSelection(newSelect) {
    selection = newSelect;
    console.log('selection changed to: ' + selection);
}
