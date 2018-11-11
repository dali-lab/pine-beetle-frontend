// this file contains all elements necessary to visualize data on the view data page
// we hold data from the server in totalData and currentData
// state, nationalForest, forest, startDate and endDate are user selections on screen
// helper methods are defined below

// user selections for state, region, and whether or not to view data for all of the US or just a specific state-region combination
var state = null;
var nationalForest = null;
var forest = null;
var showUS = true;

// user selections for date range
var startDate = Infinity;
var endDate = 0;

// original date selections
var originalStartDate = startDate;
var originalEndDate = endDate;

var totalData = []; // entire dataset available to the user
var currentData = []; // just the data that the user wants to look at based on current selection

var stateAbbrevToStateName = {
    AL:"Alabama",
    AR:"Arkansas",
    DE:"Delaware",
    FL:"Florida",
    GA:"Georgia",
    KY:"Kentucky",
    LA:"Louisiana",
    MD:"Maryland",
    MS:"Mississippi",
    NC:"North Carolina",
    NJ:"New Jersey",
    OK:"Oklahoma",
    SC:"South Carolina",
    TN:"Tennesse",
    TX:"Texas",
    VA:"Virginia"
}

// array of national and local forests available for the user to select - for selection menus only
var availableNationalForests = [];
var availableLocalForests = [];

// get local data and assign total and local data arrays
getDataFromLocal('historical_data.json');

//Source: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML
function getDataFromLocal(url) {
  // console.log("Running!!!");
  var xhr = new XMLHttpRequest;
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        // console.log("Completed!");
        // console.log(xhr.response);

        // refresh list of available states and regions
        totalData = xhr.response;
        currentData = totalData;

        // update start and end dates initially available to user and hold onto original dates
        updateStartAndEndDateFromCurrentData();
        originalStartDate = startDate;
        originalEndDate = endDate;
        document.getElementById('start-year-input').value = startDate;
        document.getElementById('end-year-input').value = endDate;

        refreshSelectionMenus();
        initializeStateDropDownMenu();
        refreshDataVisualizations();
      }
    }
  };
  xhr.send();
};

// updates currentData that will be visualized on screen
function refreshCurrentData() {
    var newSet = [];

    // if the user hasn't selected a state, take all of the data in date range
    if (state == null) {
        for (i in totalData) {
            // ensure in proper date range
            if ((totalData[i].year >= startDate && totalData[i].year <= endDate)) {
                newSet.push(totalData[i]);
            }
        }
    }
    else {
        for (i in totalData) {
            // ensure in proper date range and state
            if ((totalData[i].year >= startDate && totalData[i].year <= endDate && totalData[i].state === state)) {

                // handle case where user selects only a state
                if (nationalForest == null && forest == null) {
                    newSet.push(totalData[i]);
                }

                // handle case where user selects state and national forest but not local
                else if (nationalForest != null && forest == null) {
                    if (totalData[i].nf === nationalForest) {
                        newSet.push(totalData[i]);
                    }
                }

                // handle case where user selects state  and local forest but not national
                else if (nationalForest == null && forest != null) {
                    if (totalData[i].forest === forest) {
                        newSet.push(totalData[i]);
                    }
                }

                // handle case where user selects state, national forest, and local forest
                else if (nationalForest != null && forest != null) {
                    if (totalData[i].nf === nationalForest && totalData[i].forest === forest) {
                        newSet.push(totalData[i]);
                    }
                }
            }
        }
    }

    // store new data
    currentData = newSet;

    console.log(currentData);
    console.log(state);
    console.log(nationalForest);
    console.log(forest);

    // refresh graphs and beetle counts in the data insights section
    refreshDataVisualizations();
}

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

    if (Number.isInteger(parseInt(userEntry, 10)) && userEntry >= originalStartDate && userEntry <= originalEndDate && userEntry<=endDate) {
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

    if (Number.isInteger(parseInt(userEntry, 10)) && userEntry <= originalEndDate && userEntry >= originalStartDate && userEntry>=startDate) {
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

        // show region area and change user instructions on screen
        if (forest != null) {$("#forest").slideDown();}
        if (nationalForest != null) {$("#nf").slideDown();}

        document.getElementById('click-instructions').innerHTML = "Click <strong>United States</strong> to view metrics for the whole nation.";
    }

    // if user wants to reset state to null
    if (document.getElementById('state-select').value == "null") {
        resetCurrentData();
        document.getElementById('state-select').children[0].innerHTML = "Select State";
    }

    else {
        // update global variable to the newly selected state and get stateName
        state = document.getElementById('state-select').value
        stateName = stateAbbrevToStateName[state];

        nationalForest = null;
        forest = null;

        availableNationalForests = [];
        availableLocalForests = [];

        // refresh the data available for analysis
        refreshCurrentData();

        // update the drop down menu of new forests
        refreshSelectionMenus();

        // update all text fields on screen
        updateStateTextFields(stateName);
        updateNationalForestTextFields();
        updateForestTextFields();

        // clear forest selection menus
        document.getElementById('nf-select').selectedIndex = "0";
        document.getElementById('forest-select').selectedIndex = "0";

        $("#forest").slideUp();
        $("#nf").slideUp();

        // change selection option text
        document.getElementById('state-select').children[0].innerHTML = "Clear State Selection";
    }

    refreshSelectionMenus();
}

// trigger function for when user adjusts national forest
function changeNationalForestSelection() {
    if (document.getElementById('nf-select').value == "null") {
        nationalForest = null;
        refreshCurrentData();
        $("#nf").slideUp();
        document.getElementById('nf-select').children[0].innerHTML = "Select National Forest";
    }

    else {
        nationalForest = document.getElementById('nf-select').value
        updateNationalForestTextFields();

        // refresh the data available for analysis
        refreshCurrentData();

        // display prediction areas as necessary
        if (forest != null) {$("#forest").slideDown();}
        if (nationalForest != null) {$("#nf").slideDown();}

        // change selection option text
        document.getElementById('nf-select').children[0].innerHTML = "Clear Natl Forest Selection";
    }

    refreshSelectionMenus();
}

// trigger function for when user adjusts local forest
function changeForestSelection() {
    if (document.getElementById('forest-select').value == "null") {
        forest = null;
        refreshCurrentData();
        $("#forest").slideUp();

        if (nationalForest == null) {
            $("#nf").slideUp();
        }

        document.getElementById('forest-select').children[0].innerHTML = "Select Forest";
    }

    else {
        forest = document.getElementById('forest-select').value
        updateForestTextFields();

        // refresh the data available for analysis
        refreshCurrentData();

        // display prediction areas as necessary
        if (forest != null) {$("#forest").slideDown();}
        if (nationalForest != null) {$("#nf").slideDown();}

        // change selection option text
        document.getElementById('forest-select').children[0].innerHTML = "Clear Forest Selection";
    }

    refreshSelectionMenus();
}

// trigger function for when user wants to switch between viewing data for all US or just a specific state
function switchNationSelection(newSelect) {
    // if the user wants to see only metrics for the United States
    if (newSelect === "us") {
        showUS = true;
        state = null;
        nationalForest = null;
        forest = null;

        availableNationalForests = [];
        availableLocalForests = [];

        // update button coloring
        document.getElementById("select-buttons").children[0].setAttribute("id","active");
        document.getElementById("select-buttons").children[1].removeAttribute("id");

        // hide region area and change user instructions
        $("#forest").slideUp();
        $("#nf").slideUp();
        document.getElementById('click-instructions').innerHTML = "Click <strong>State Selection</strong> to view metrics in specific states.";

        // change state to United States
        textFields = document.getElementsByClassName("state-text");
        for (i = 0; i < textFields.length; i++) {
            textFields[i].innerHTML = "United States";
        }

        // refresh the data available for analysis and reset
        refreshCurrentData();
        refreshSelectionMenus();

        // change selection menus to default selection
        document.getElementById('state-select').selectedIndex = "0";
        document.getElementById('nf-select').selectedIndex = "0";
        document.getElementById('forest-select').selectedIndex = "0";
    }
    // if the user wants to see metrics for a specific location
    else {
        showUS = false;

        // update button coloring
        document.getElementById("select-buttons").children[0].removeAttribute("id");
        document.getElementById("select-buttons").children[1].setAttribute("id","active");

        // show region area and change user instructions
        if (forest != null) {$("#forest").slideDown();}
        if (nationalForest != null) {$("#nf").slideDown();}
        document.getElementById('click-instructions').innerHTML = "Click <strong>United States</strong> to view metrics for the whole nation.";

        // refresh the list of available states and regions on the screen
        refreshSelectionMenus();

        // update selection menus and text fields
        document.getElementById('state-select').selectedIndex = "1";
        changeStateSelection();

        // refresh the data available for analysis
        refreshCurrentData();
    }
}

// refreshes the selection menus based on the available data for the desired dates, state, and region
function refreshSelectionMenus() {
    updateAvailableStatesAndForestsInDropDown();
    clearSelectionOptionNodes();
    updateNationalForestDropDown();
    updateForestDropDown();
}

// update the arrays of available forests to be placed in drop down menus based on current data
function updateAvailableStatesAndForestsInDropDown() {
    // clear arrays
    availableNationalForests = [];
    availableLocalForests = [];

    for (obj in currentData) {
        // grab national forest and local forests
        thisNF = currentData[obj].nf;
        thisForest = currentData[obj].forest;

        // add to arrays
        if (!availableNationalForests.includes(thisNF) && thisNF != "") {
            availableNationalForests.push(thisNF);
        }
        if (!availableLocalForests.includes(thisForest) && thisForest != "") {
            availableLocalForests.push(thisForest);
        }
    }
}

// remove all option elements that are child nodes of the region selection menu
function clearSelectionOptionNodes() {
    // grab a reference to DOM nf select node and its children
    nfSelectNode = document.getElementById('nf-select');
    optionDivs = nfSelectNode.children;

    // remove all children of the select menu but the default select region
    while (optionDivs.length > 1) {
        optionDivs[1].remove();
    }

    // grab a reference to DOM forest select node and its children
    forestSelectNode = document.getElementById('forest-select');
    optionDivs = nfSelectNode.children;

    // remove all children of the select menu but the default select region
    while (optionDivs.length > 1) {
        optionDivs[1].remove();
    }
}

function initializeStateDropDownMenu() {
    // grab a reference to DOM state select node and its children
    stateSelectNode = document.getElementById('state-select');
    optionDivs = stateSelectNode.children;

    // iterate over each state abbreviation in the abbreviations map
    for (var stateAbbrev in stateAbbrevToStateName) {
        // add a state selection option for each state in the map
        optionElement = document.createElement("OPTION");
        optionElement.setAttribute('value', stateAbbrev);
        textField = document.createTextNode(stateAbbrevToStateName[stateAbbrev]);
        optionElement.appendChild(textField);
        stateSelectNode.appendChild(optionElement);
    }
}

// update all national forest dropdown options in the DOM
function updateNationalForestDropDown() {
    if (state != null) {
        // grab a reference to DOM region select node and its children
        nfSelectNode = document.getElementById('nf-select');
        optionDivs = nfSelectNode.children;

        // remove all children of the select menu but the default select region
        while (optionDivs.length > 1) {
            optionDivs[1].remove();
        }

        // add option elements to the select menu for each region associated with
        // the current state that the user selected
        for (i in availableNationalForests) {
            optionElement = document.createElement("OPTION");
            optionElement.setAttribute('value',availableNationalForests[i]);
            textField = document.createTextNode(availableNationalForests[i]);
            optionElement.appendChild(textField);
            nfSelectNode.appendChild(optionElement);

            if (nationalForest!=null && availableNationalForests[i]==nationalForest) {
                document.getElementById('nf-select').selectedIndex = i+1;
            }
        }
    }
}

// update all national forest dropdown options in the DOM
function updateForestDropDown() {
    if (state != null) {
        // grab a reference to DOM region select node and its children
        forestSelectNode = document.getElementById('forest-select');
        optionDivs = forestSelectNode.children;

        // remove all children of the select menu but the default select region
        while (optionDivs.length > 1) {
            optionDivs[1].remove();
        }

        // add option elements to the select menu for each region associated with
        // the current state that the user selected
        for (i in availableLocalForests) {
            optionElement = document.createElement("OPTION");
            optionElement.setAttribute('value',availableLocalForests[i]);
            textField = document.createTextNode(availableLocalForests[i]);
            optionElement.appendChild(textField);
            forestSelectNode.appendChild(optionElement);

            if (forest!=null && availableLocalForests[i]==forest) {
                document.getElementById('forest-select').selectedIndex = i+1;
            }
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

// helper function: change dom elements to new nf selection
function updateNationalForestTextFields() {
    textFields = document.getElementsByClassName("nf-text");

    for (i = 0; i < textFields.length; i++) {
        textFields[i].innerHTML = nationalForest;
    }
}

// helper function: change dom elements to new forest selection
function updateForestTextFields() {
    textFields = document.getElementsByClassName("forest-text");

    for (i = 0; i < textFields.length; i++) {
        textFields[i].innerHTML = forest;
    }
}

// toggle view function
// moves the prediction model into the data-analytics area
function movePredictionModelDown() {
    // grab references
    mapArea = document.getElementById('map-area');
    predModel = document.getElementById('prediction-model');
    dataInsightsHolder = document.getElementById('data-insights-holder');

    // move DOM nodes and remove styling class
    dataInsightsHolder.appendChild(predModel);
    document.getElementById('data-insights').classList.add("flex-item-left");
    mapArea.classList.remove("flex-item-left");


    // adjust onclick event
    document.getElementById('adjust-map-size-button').setAttribute( "onclick", "swapMapAndDataInsights('round1');");
}

// toggle view function
// reorder the map area and the data insights area
function swapMapAndDataInsights(round) {
    container = document.getElementById('content');
    dataInsightsHolder = container.children[2];
    mapAreaContainer = container.children[1];

    // change the order
    container.removeChild(mapAreaContainer);
    container.appendChild(mapAreaContainer);

    // adjust onclick event
    if (round == "round1") {
        document.getElementById('adjust-map-size-button').setAttribute( "onclick", "movePredictionModelUp();");
    }
    else {
        document.getElementById('adjust-map-size-button').setAttribute( "onclick", "movePredictionModelDown();");
    }
}

// toggle view function
// moves the prediction model up into the map area
function movePredictionModelUp() {
    // grab references
    mapArea = document.getElementById('map-area');
    predModel = document.getElementById('prediction-model');
    mapAreaContainer = document.getElementById('map-area-container');

    // move DOM nodes and remove styling class
    mapAreaContainer.appendChild(predModel);
    mapArea.classList.add("flex-item-left");
    document.getElementById('data-insights').classList.remove("flex-item-left");

    // adjust onclick event
    document.getElementById('adjust-map-size-button').setAttribute( "onclick", "swapMapAndDataInsights('round2');");
}

// trigger function when user presses reset data button
function resetCurrentData() {
    // set current to total and update menus/dropdowns
    currentData = totalData;
    updateStartAndEndDateFromCurrentData();
    document.getElementById('start-year-input').value = startDate;
    document.getElementById('end-year-input').value = endDate;
    refreshSelectionMenus();
    switchNationSelection('us');
    document.getElementById('nf-select').selectedIndex = "0";
    document.getElementById('forest-select').selectedIndex = "0";

    state = null;
    nationalForest = null;
    forest = null;

    availableNationalForests = [];
    availableLocalForests = [];

    document.getElementById('state-select').children[0].innerHTML = "Select State";
    document.getElementById('nf-select').children[0].innerHTML = "Select National Forest";
    document.getElementById('forest-select').children[0].innerHTML = "Select Forest";
}

// start the loading animation for the prediction model area - call this function, then run the model
function startLoadingAnimation() {
    // grab children and set opacity of all elements in the div to 0.2
    areaDivElements = document.getElementById('prediction-model').children;

    for (i=0;i<areaDivElements.length-1;i++) {
        if (areaDivElements[i].id != "load-icon") {
            areaDivElements[i].style.opacity = 0.15;
        }
    }

    // add load icon
    document.getElementById('load-icon').style.opacity = 1;
}

// stop the loading animation for the predictino model area - call this function after the model finishes running
function stopLoadingAnimation() {
    // remove load icon
    document.getElementById('load-icon').style.opacity = 0;

    // grab children and set opacity of all elements in the div back to 1
    areaDivElements = document.getElementById('prediction-model').children;

    for (i=0;i<areaDivElements.length-1;i++) {
        if (areaDivElements[i].id != "load-icon") {
            areaDivElements[i].style.opacity = 1;
        }
    }
}

// update dom elements in data insights section
function refreshDataVisualizations() {
    var totalCleridsPerTwoWeeks = 0;
    var totalSPBPerTwoWeeks = 0;
    var totalPercentSPB = 0;
    var totalSpots = 0;
    var totalSpotsPerHundredKM = 0;

    for (obj in currentData) {
        totalCleridsPerTwoWeeks += currentData[obj].cleridsPerTwoWeeks;
        totalSPBPerTwoWeeks += currentData[obj].spbPerTwoWeeks;
        totalPercentSPB += currentData[obj].percentSpb;
        totalSpots += currentData[obj].spots;
        totalSpotsPerHundredKM += currentData[obj].spotsPerHundredKm;
    }

    document.getElementById('total-clerids-per-two-weeks').innerHTML = "Total Clerids Per Two Weeks: " + totalCleridsPerTwoWeeks.toLocaleString(); // toLocalString adds commas for thousands places
    document.getElementById('total-spb-per-two-weeks').innerHTML = "Total SPB Per Two Weeks: " + totalSPBPerTwoWeeks.toLocaleString();
    document.getElementById('avg-percent-spb').innerHTML = "Average Percent SPB: " + (totalPercentSPB / currentData.length).toFixed(2) + "%";  // toFixed is number of decimal places
    document.getElementById('total-spots').innerHTML = "Total Spots: " + totalSpots.toLocaleString();
    document.getElementById('total-spots-per-hundred-km').innerHTML = "Total Spots Per Hundred KM: " + totalSpotsPerHundredKM.toLocaleString();
}
