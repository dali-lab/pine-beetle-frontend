var state = null;
var region = null;
var showUS = false;

// handle selection buttons between United States and Current Selection
function switchNationSelection(newSelect) {
    if (newSelect === "us") {
        showUS = true;
    }
    else {
        showUS = false;
    }

    console.log('selection changed to: ' + newSelect);
    console.log('showUS is now ' + showUS);
}

// handle state selection
function changeStateSelection() {
    // hold a reference to the newly selected state
    state = document.getElementById('state-select').value

    // update the drop down menu of new regions then select the first region
    updateRegionOptions();
    document.getElementById('region-select').selectedIndex = "0";
    region = document.getElementById('region-select').value

    // update all text fields on screen
    updateStateTextFields();
    updateRegionTextFields();
}

// handle region selection
function changeRegionSelection() {
    region = document.getElementById('region-select').value
    updateRegionTextFields();
}

// change dom elements to new state selection
function updateStateTextFields() {
    textFields = document.getElementsByClassName("state-text");

    for (i = 0; i < textFields.length; i++) {
        textFields[i].innerHTML = state;
    }
}

// change dom elements to new region selection
function updateRegionTextFields() {
    textFields = document.getElementsByClassName("region-text");

    for (i = 0; i < textFields.length; i++) {
        textFields[i].innerHTML = region;
    }
}

// map of all regions for each state
var regionMap = {
    Georgia:["GA1", "GA2", "GA3", "GA4"],
    NewHampshire:["NH1", "NH2", "NH3", "NH4"],
    NorthCarolina:["NC1", "NC2", "NC3", "NC4"],
    SouthCarolina:["SC1", "SC2", "SC3", "SC4"]
}

// update all region options in DOM
function updateRegionOptions() {
    regions = regionMap[state.replace(/ /g,'')]; // .replace method removes spaces in state name

    // grab a reference to DOM region select node and its children
    regionSelectNode = document.getElementById('region-select');
    optionDivs = regionSelectNode.children;

    // remove all children of the select menu
    while (optionDivs.length > 0) {
        optionDivs[0].remove();
    }

    // add option elements to the select menu for each region associated with
    // the current state that the user selected
    for (i=0; i<regions.length; i++) {
        optionElement = document.createElement("OPTION");
        optionElement.setAttribute('value',regions[i].replace(/ /g,''));
        textField = document.createTextNode(regions[i]);
        optionElement.appendChild(textField);
        regionSelectNode.appendChild(optionElement);
    }
}
