// this file contains all elements necessary to visualize data on the view data page
// we hold data from the server in totalData and currentData
// state, region, startDate and endDate are user selections on screen
// stateRegionMap holds all states and regions that should be user selection options
// helper methods are defined below

// user selections for state, region, and whether or not to view data for all of the US or just a specific state-region combination
var state = null;
var region = null;
var showUS = true;

// user selections for date range
var startDate = Infinity;
var endDate = 0;

var totalData = [{"_id":"5bcb7928763d69464cb8d23e","yearNumber":1,"state":"AL","nf":"BANKHEAD","classification":"RD","forest":"BANKHEAD RD","stateCode":1,"forestCode":1,"latitude":34.23306,"longitude":-87.31112,"host":20.68,"year":1986,"spbPerTwoWeeks":null,"cleridsPerTwoWeeks":null,"spots":564,"spotsPerHundredKm":273,"percentSpb":null,"__v":0,"id":"5bcb7928763d69464cb8d23e"},{"_id":"5bcb7928763d69464cb8d23f","yearNumber":2,"state":"AL","nf":"test","classification":"RD","forest":"BANKHEAD RD","stateCode":1,"forestCode":1,"latitude":34.23306,"longitude":-87.31112,"host":20.68,"year":1987,"spbPerTwoWeeks":931,"cleridsPerTwoWeeks":210,"spots":600,"spotsPerHundredKm":290,"percentSpb":null,"__v":0,"id":"5bcb7928763d69464cb8d23f"},{"_id":"5bcb792b763d69464cb8deb5","yearNumber":23,"state":"SC","nf":"","classification":"CO","forest":"Lexington Co.","stateCode":null,"forestCode":null,"latitude":null,"longitude":null,"host":null,"year":2008,"spbPerTwoWeeks":1,"cleridsPerTwoWeeks":8,"spots":65,"spotsPerHundredKm":null,"percentSpb":14,"__v":0,"id":"5bcb792b763d69464cb8deb5"},{"_id":"5bcb792b763d69464cb8dc75","yearNumber":1,"state":"SC","nf":"SUMTER","classification":"RD","forest":"ENOREE RD","stateCode":12,"forestCode":1,"latitude":34.52179,"longitude":-81.62842,"host":18.23,"year":1986,"spbPerTwoWeeks":null,"cleridsPerTwoWeeks":null,"spots":null,"spotsPerHundredKm":null,"percentSpb":null,"__v":0,"id":"5bcb792b763d69464cb8dc75"}];

// entire dataset available to the user
var currentData = []; // just the data that the user wants to look at based on current selection

// set totalData and currentData from the historical data
// getDataFromLocal('historical_data.json');
currentData = totalData;

// set the height of the map
resizeMap()

// this holds all possible states that data exists for based on the user-selected years
// all array elements in index 1 or greater represent associated regions for that state
var stateRegionMap = {
    AL:["Alabama"],
    AR:["Arkansas"],
    DE:["Delaware"],
    FL:["Florida"],
    GA:["Georgia"],
    KY:["Kentucky"],
    LA:["Louisiana"],
    MD:["Maryland"],
    MS:["Mississippi"],
    NC:["North Carolina"],
    NJ:["New Jersey"],
    OK:["Oklahoma"],
    SC:["South Carolina"],
    TN:["Tennesse"],
    TX:["Texas"],
    VA:["Virginia"]
}

// update start and end dates initially available to user and hold onto original dates
updateStartAndEndDateFromCurrentData();
const originalStartDate = startDate;
const originalEndDate = endDate;
document.getElementById('start-year-input').value = startDate;
document.getElementById('end-year-input').value = endDate;

// refresh list of available states and regions
refreshSelectionMenus();
initializeDropDownMenu();

// updates currentData that will be visualized on screen
function refreshCurrentData() {
    var newSet = [];
    // iterate through data and adjust for date range and state/region selection
    for (i in totalData) {
        if ((totalData[i].year >= startDate && totalData[i].year <= endDate) && (state != null && totalData[i].state === state) && (region != null && totalData[i].nf === region)) {
            newSet.push(totalData[i]);
        }
    }
    currentData = newSet;
    refreshSelectionMenus();
}

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

// updates the start and end dates for the available data
function updateStartAndEndDateFromCurrentData() {
    for (obj in currentData) {
        // set startDate
        if (currentData[obj].year < startDate) {
            startDate = currentData[obj].year;
        }
        // set endDate
        if (currentData[obj].year > endDate) {
            endDate = currentData[obj].year;
        }
    }

    // TODO: update the dom here for start and end date initially available to user

}

// trigger function for when user presses enter in start date field
document.getElementById('start-year-input').onkeypress=function(e) {
    if(e.keyCode==13){
        document.getElementById('start-year-submit').click();
    }
}

// trigger function for when user presses enter in end date field
document.getElementById('end-year-input').onkeypress=function(e) {
    if(e.keyCode==13){
        document.getElementById('end-year-submit').click();
    }
}

// trigger function for when user adjusts start date
function updateStartDate() {
    userEntry = document.getElementById('start-year-input').value;

    if (Number.isInteger(parseInt(userEntry, 10)) && userEntry >= originalStartDate) {
        startDate = userEntry;
        refreshCurrentData();
        console.log("start date is now: " + startDate);
    }

    else {
        document.getElementById('start-year-input').value = startDate;
    }
}

// trigger function for when user adjusts end date
function updateEndDate() {
    userEntry = document.getElementById('end-year-input').value;

    if (Number.isInteger(parseInt(userEntry, 10)) && userEntry <= originalEndDate) {
        endDate = userEntry;
        refreshCurrentData();
        console.log("end date is now: " + endDate);
    }

    else {
        document.getElementById('end-year-input').value = endDate;
    }
}

// trigger function for when user adjusts state
function changeStateSelection() {
    if (showUS) {
        showUS = false;

        // update button coloring
        document.getElementById("select-buttons").children[0].removeAttribute("id");
        document.getElementById("select-buttons").children[1].setAttribute("id","active");

        // show region area
        document.getElementById("region").style.display = "block";
    }

    // update global variable to the newly selected state and get stateName
    state = document.getElementById('state-select').value
    stateName = stateRegionMap[state][0];

    // update the drop down menu of new regions then select the first region
    updateRegionDropDown();
    document.getElementById('region-select').selectedIndex = "1";
    region = document.getElementById('region-select').value

    // update all text fields on screen
    updateStateTextFields(stateName);
    updateRegionTextFields();

    // refresh the data available for analysis
    refreshCurrentData();
}

// trigger function for when user adjusts region
function changeRegionSelection() {
    region = document.getElementById('region-select').value
    updateRegionTextFields();

    // refresh the data available for analysis
    refreshCurrentData();
    console.log(stateRegionMap);
}

// trigger function for when user wants to switch between viewing data for all US or just a specific state
function switchNationSelection(newSelect) {

    // if the user wants to see only metrics for the United States
    if (newSelect === "us") {
        showUS = true;

        // update button coloring
        document.getElementById("select-buttons").children[0].setAttribute("id","active");
        document.getElementById("select-buttons").children[1].removeAttribute("id");

        // hide region area
        document.getElementById("region").style.display = "none";

        // change state to United States
        textFields = document.getElementsByClassName("state-text");
        for (i = 0; i < textFields.length; i++) {
            textFields[i].innerHTML = "United States";
        }

        // change selection menus to default selection
        document.getElementById('state-select').selectedIndex = "0";
        document.getElementById('region-select').selectedIndex = "0";

        resizeMap()
    }
    // if the user wants to see metrics for a specific location
    else {
        showUS = false;

        // update button coloring
        document.getElementById("select-buttons").children[0].removeAttribute("id");
        document.getElementById("select-buttons").children[1].setAttribute("id","active");

        // show region area
        document.getElementById("region").style.display = "block";

        // refresh the list of available states and regions on the screen
        refreshSelectionMenus();

        // update selection menus and text fields
        document.getElementById('state-select').selectedIndex = "1";
        changeStateSelection();

        resizeMap()
    }

    // refresh the data available for analysis
    refreshCurrentData();
}

// refreshes the selection menus based on the available data for the desired dates, state, and region
function refreshSelectionMenus() {
    updateAvailableStatesAndRegionsInDropDown();
    clearSelectionOptionNodes();
    updateRegionDropDown();
}

// update the map of available states and regions to be placed in drop down menu based on current data
// a state will not appear as a selection option if it does not have any associated regions
function updateAvailableStatesAndRegionsInDropDown() {
    // clear stateRegionMap
    for (stateAbbrev in stateRegionMap) {
        stateRegionMap[stateAbbrev] = [stateRegionMap[stateAbbrev][0]];
    }

    // update stateRegionMap based on total data
    for (obj in totalData) {
        // if the state region map doesn't include this region, add it
        if (!(stateRegionMap[totalData[obj].state].includes(totalData[obj].nf)) && totalData[obj].nf != "") {
            stateRegionMap[totalData[obj].state].push(totalData[obj].nf);
        }
    }
}

// remove all option elements that are child nodes of the region selection menu
function clearSelectionOptionNodes() {
    // grab a reference to DOM region select node and its children
    regionSelectNode = document.getElementById('region-select');
    optionDivs = regionSelectNode.children;

    // remove all children of the select menu but the default select region
    while (optionDivs.length > 1) {
        optionDivs[1].remove();
    }
}

function initializeDropDownMenu() {
    // grab a reference to DOM state select node and its children
    stateSelectNode = document.getElementById('state-select');
    optionDivs = stateSelectNode.children;

    // iterate over each state abbreviation in the stateRegionMap
    for (var stateAbbrev in stateRegionMap) {
        // add a state selection option if regions exist for that state
        if (stateRegionMap.hasOwnProperty(stateAbbrev) && stateRegionMap[stateAbbrev].length > 1) {

            // add a state selection option for each state in the map
            optionElement = document.createElement("OPTION");
            optionElement.setAttribute('value', stateAbbrev);
            textField = document.createTextNode(stateRegionMap[stateAbbrev][0]);
            optionElement.appendChild(textField);
            stateSelectNode.appendChild(optionElement);
        }
    }
}

// update all region dropdown options in the DOM
function updateRegionDropDown() {
    if (state != null) {
        regions = stateRegionMap[state];

        // grab a reference to DOM region select node and its children
        regionSelectNode = document.getElementById('region-select');
        optionDivs = regionSelectNode.children;

        // remove all children of the select menu but the default select region
        while (optionDivs.length > 1) {
            optionDivs[1].remove();
        }

        // add option elements to the select menu for each region associated with
        // the current state that the user selected
        for (i=1; i<regions.length; i++) {
            optionElement = document.createElement("OPTION");
            optionElement.setAttribute('value',regions[i]);
            textField = document.createTextNode(regions[i]);
            optionElement.appendChild(textField);
            regionSelectNode.appendChild(optionElement);
        }
    }
}

// helper function: change dom elements to new state selection
function updateStateTextFields(stateName) {
    textFields = document.getElementsByClassName("state-text");

    for (i = 0; i < textFields.length; i++) {
        textFields[i].innerHTML = stateName;
    }
}

// helper function: change dom elements to new region selection
function updateRegionTextFields() {
    textFields = document.getElementsByClassName("region-text");

    for (i = 0; i < textFields.length; i++) {
        textFields[i].innerHTML = region;
    }
}

// adjust height of map
function resizeMap() {
    console.log(document.getElementById('viewDiv').style.height);
    console.log(document.getElementById('prediction-model').style.height)
    document.getElementById('viewDiv').style.height = document.getElementById('prediction-model').style.height;
}

// when user resizes screen
window.onresize = resizeMap();
