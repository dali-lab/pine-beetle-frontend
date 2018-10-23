// user selections for state, region, and whether or not to view data for all
// of the US or just a specific state-region combination
var state = null;
var region = null;
var showUS = true;

// user selection for start and end date they would like to view data on
// TODO update this to auto grab first and last year from the data
var startDate = 1985;
var endDate = new Date().getFullYear();

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

// refresh the list of available states and regions on the screen
refreshSelectionMenus();

// refreshes the selection menus based on the available data for the desired dates, state, and region
function refreshSelectionMenus() {
    updateAvailableStatesAndRegions();
    clearSelectionOptionNodes();
    populateSelectionMenus();
}

// update the map of available states and regions based on user selected years
// TODO this function will add/remove available states and regions based on the data that the user has selected and wishes to view
function updateAvailableStatesAndRegions() {
    // TODO query data here -- @MADDIE

    // a state will not appear as a selection option if it does not have any associated regions
    // to clear a state and indicate that it should not show up on the screen, remove all elements in it's associated array in the map except index 0 (the state name)

    // this is temporary
    stateRegionMap = {
        AL:["Alabama", "BANKHEAD RD", "FRANKLIN AL","LOWNDES AL","Monroe Co", "OAKMULGEE RD", "SHOAL CREEK RD","TALLADEGA RD","TALLAPOOSA AL"],
        AR:["Arkansas", "CADDO RD","CLARK AR","COLUMBIA AR","DREW AR","MENA RD","NEVADA AR","ODEN RD","WOMBLE RD"],
        DE:["Delaware", "Sussex Co."],
        FL:["Florida", "ALACHUA FL","BAKER FL","BRADFORD FL","Clay Co.","COLUMBIA FL","DUVAL FL","Flagler-St. John's Co.","GADSDEN FL","HAMILTON FL"],
        GA:["Georgia", "GA1", "GA2", "GA3", "GA4"],
        KY:["Kentucky", "KY1", "KY2"],
        LA:["Louisiana", "LA1", "LA2"],
        MD:["Maryland", "MD1", "MD2"],
        MS:["Mississippi", "MS1", "MS2"],
        NC:["North Carolina", "NC1", "NC2", "NC3", "NC4"],
        NJ:["New Jersey", "NJ1", "NJ2"],
        OK:["Oklahoma", "OK1", "OK2"],
        SC:["South Carolina", "SC1", "SC2", "SC3", "SC4"],
        TN:["Tennesse", "TN1", "TN2"],
        TX:["Texas", "TX1", "TX2"],
        VA:["Virginia", "VA1", "VA2"]
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

// handle selection buttons between United States and Current Selection
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
}

// handle state selection
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
}

// handle region selection
function changeRegionSelection() {
    region = document.getElementById('region-select').value
    updateRegionTextFields();
}

// change dom elements to new state selection
function updateStateTextFields(stateName) {
    textFields = document.getElementsByClassName("state-text");

    for (i = 0; i < textFields.length; i++) {
        textFields[i].innerHTML = stateName;
    }
}

// change dom elements to new region selection
function updateRegionTextFields() {
    textFields = document.getElementsByClassName("region-text");

    for (i = 0; i < textFields.length; i++) {
        textFields[i].innerHTML = region;
    }
}
