var state = null;
var region = null;
var showUS = true;

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

        // change selection menus to default
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

    // hold a reference to the newly selected state
    state = document.getElementById('state-select').value

    // update the drop down menu of new regions then select the first region
    updateRegionOptions();
    document.getElementById('region-select').selectedIndex = "1";
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
    Alabama:["BANKHEAD RD", "FRANKLIN AL","LOWNDES AL","Monroe Co", "OAKMULGEE RD", "SHOAL CREEK RD","TALLADEGA RD","TALLAPOOSA AL"],
    Arkansas:["CADDO RD","CLARK AR","COLUMBIA AR","DREW AR","MENA RD","NEVADA AR","ODEN RD","WOMBLE RD"],
    Delaware:["Sussex Co."],
    Florida:["ALACHUA FL","BAKER FL","BRADFORD FL","Clay Co.","COLUMBIA FL","DUVAL FL","Flagler-St. John's Co.","GADSDEN FL","HAMILTON FL"],
    Georgia:["GA1", "GA2", "GA3", "GA4"],
    NorthCarolina:["NC1", "NC2", "NC3", "NC4"],
    SouthCarolina:["SC1", "SC2", "SC3", "SC4"]
}

// update all region options in DOM
function updateRegionOptions() {
    regions = regionMap[state.replace(/ /g,'')]; // .replace method removes spaces in state name

    // grab a reference to DOM region select node and its children
    regionSelectNode = document.getElementById('region-select');
    optionDivs = regionSelectNode.children;

    // remove all children of the select menu but the default select region
    while (optionDivs.length > 1) {
        optionDivs[1].remove();
    }

    // add option elements to the select menu for each region associated with
    // the current state that the user selected
    for (i=0; i<regions.length; i++) {
        optionElement = document.createElement("OPTION");
        optionElement.setAttribute('value',regions[i]);
        textField = document.createTextNode(regions[i]);
        optionElement.appendChild(textField);
        regionSelectNode.appendChild(optionElement);
    }
}
