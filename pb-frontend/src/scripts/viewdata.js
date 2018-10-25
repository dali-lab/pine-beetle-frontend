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

// entire dataset available to the user
var totalData = [{"_id":"5bcb7928763d69464cb8d23e","yearNumber":1,"state":"AL","nf":"BANKHEAD","classification":"RD","forest":"BANKHEAD RD","stateCode":1,"forestCode":1,"latitude":34.23306,"longitude":-87.31112,"host":20.68,"year":1986,"spbPerTwoWeeks":null,"cleridsPerTwoWeeks":null,"spots":564,"spotsPerHundredKm":273,"percentSpb":null,"__v":0,"id":"5bcb7928763d69464cb8d23e"},{"_id":"5bcb7928763d69464cb8d23f","yearNumber":2,"state":"AL","nf":"BANKHEAD","classification":"RD","forest":"BANKHEAD RD","stateCode":1,"forestCode":1,"latitude":34.23306,"longitude":-87.31112,"host":20.68,"year":1987,"spbPerTwoWeeks":931,"cleridsPerTwoWeeks":210,"spots":600,"spotsPerHundredKm":290,"percentSpb":null,"__v":0,"id":"5bcb7928763d69464cb8d23f"},{"_id":"5bcb7928763d69464cb8d241","yearNumber":4,"state":"AL","nf":"BANKHEAD","classification":"RD","forest":"BANKHEAD RD","stateCode":1,"forestCode":1,"latitude":34.23306,"longitude":-87.31112,"host":20.68,"year":1989,"spbPerTwoWeeks":390,"cleridsPerTwoWeeks":397,"spots":45,"spotsPerHundredKm":22,"percentSpb":null,"__v":0,"id":"5bcb7928763d69464cb8d241"}];
//getData("historical_data.json");

// just the data that the user wants to look at based on current selection
var currentData = totalData;

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

// update start and end dates initially available to user then refresh list of available states and regions
updateStartAndEndDateFromCurrentData();
refreshSelectionMenus();

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

// fetch json data and put into totalData
function getData(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            totalData = JSON.parse(this.responseText);
        }
    };
    console.log("Done!");
    xmlhttp.open("GET", "historical_data.json", true);
    xmlhttp.send();
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

// trigger function for when user adjusts start date
function updateStartDate(year) {
    startDate = year;
    refreshCurrentData();
}

// trigger function for when user adjusts end date
function updateEndDate(year) {
    endDate = year;
    refreshCurrentData();
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
    }

    // refresh the data available for analysis
    refreshCurrentData();
}

// refreshes the selection menus based on the available data for the desired dates, state, and region
function refreshSelectionMenus() {
    updateAvailableStatesAndRegionsInDropDown();
    clearSelectionOptionNodes();
    populateSelectionMenus();
}

// update the map of available states and regions to be placed in drop down menu based on current data
// a state will not appear as a selection option if it does not have any associated regions
function updateAvailableStatesAndRegionsInDropDown() {
    // clear stateRegionMap
    for (stateAbbrev in stateRegionMap) {
        stateRegionMap[stateAbbrev] = [stateRegionMap[stateAbbrev][0]];
    }

    // update stateRegionMap based on current data
    for (obj in currentData) {
        // if the state region map doesn't include this region, add it
        if (!stateRegionMap[currentData[obj].state].includes(currentData[obj].nf)) {
            stateRegionMap[currentData[obj].state].push(currentData[obj].nf);
        }
    }
}

// remove all option elements that are child nodes of the selection menus
function clearSelectionOptionNodes() {
    // clear state selection menu
    // grab a reference to DOM state select node and its children
    stateSelectNode = document.getElementById('state-select');
    optionDivs = stateSelectNode.children;

    // remove all children of the select menu but the default select state
    while (optionDivs.length > 1) {
        optionDivs[1].remove();
    }

    // clear region selection menus
    // grab a reference to DOM region select node and its children
    regionSelectNode = document.getElementById('region-select');
    optionDivs = regionSelectNode.children;

    // remove all children of the select menu but the default select region
    while (optionDivs.length > 1) {
        optionDivs[1].remove();
    }
}

// creates option elements as children nodes to the selection menu for all available states and regions in the map
function populateSelectionMenus() {
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

    // if the user has selected a state, update region options
    if (state != null) {
        updateRegionDropDown();
    }
}

// update all region dropdown options in the DOM
function updateRegionDropDown() {
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
