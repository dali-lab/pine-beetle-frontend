import { Component } from 'react';
import axios from 'axios';
var jQuery = require("jquery");

class DataController extends Component {
    constructor(props) {
        super(props);

        // determine initial state variables based on cookies
        var stateName = (this.getCookie("stateName") !== null && this.getCookie("stateName") !== "null") ? this.getCookie("stateName") : null;
        var stateAbbreviation = (this.getCookie("stateAbbreviation") !== null && this.getCookie("stateAbbreviation") !== "null") ? this.getCookie("stateAbbreviation") : null;
        var nationalForest = (this.getCookie("nationalForest") !== null && this.getCookie("nationalForest") !== "null") ? this.getCookie("nationalForest") : null;
        var forest = (this.getCookie("forest") !== null && this.getCookie("forest") !== "null") ? this.getCookie("forest") : null;
        var startDate = (this.getCookie("startDate") !== null && this.getCookie("startDate") !== "null") ? this.getCookie("startDate") : 1986;
        var endDate = (this.getCookie("endDate") !== null && this.getCookie("endDate") !== "null") ? this.getCookie("endDate") : 2010;
        var predictiveModelDate = (this.getCookie("predictiveModelDate") !== null && this.getCookie("predictiveModelDate") !== "null") ? this.getCookie("predictiveModelDate") : 2010;
        var runningModel = false;
        var updatedStateSelection = true;

        // set state based off cookies
        this.state = {
            // selections the user can make for state, forest, etc.
            userFilters: {
                stateName: stateName,
                stateAbbreviation: stateAbbreviation,
                nationalForest: nationalForest,
                forest: forest,
                startDate: startDate,
                endDate: endDate,
                predictiveModelDate: predictiveModelDate,
                originalStartDate: null,
                originalEndDate: null,
            },

            // arrays of states, forests, etc. to populate drop-down menus with
            dropDownContent: {
                availableStates: [],
                availableLocalForests: [],
                availableNationalForests: [],
                availableYears: [],
                availableModelYears: []
            },

            // arrays of JSON data loaded from database
            historicalData: {
                currentData: [],
                summarizedDataByLatLong: null,
                summarizedDataByYear: null
            },

            predictiveModelOutputArray: [],

            // outputs from predictive model
            predictiveModelOutputs: {
                expSpotsIfOutbreak: 0,
                prob0spots: 0,
                prob19spots: 0,
                prob53spots: 0,
                prob147spots: 0,
                prob402spots: 0,
                prob1095spots: 0
            },

            // inputs to predictive model
            predictiveModelInputs: {
                SPB: 0,
                cleridst1: 0,
                spotst1: 0,
                spotst2: 0,
                endobrev: 1
            },

            runningModel: runningModel,
            updatedStateSelection: updatedStateSelection,
            url: "",

            // map of state abbreviations to their names
            stateAbbrevToStateName: {
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
            },

            stateAbbrevToStateID: {
                AL: "01",
                AR: "05",
                DE: "10",
                FL: "12",
                GA: "13",
                KY: "21",
                LA: "22",
                MD: "24",
                MS: "28",
                NC: "37",
                NJ: "34",
                OK: "40",
                SC: "45",
                TN: "47",
                TX: "48",
                VA: "51"
            },

            stateToZoomLevel: {
                AL: [[-87.048138713534,32.752672386723674],6],
                AR: [[-92.80060726071615,34.85911792533683],6],
                DE: [[-84.3880,33.7490],4.8],
                FL: [[-84.3880,33.7490],4.8],
                GA: [[-83.61491117447409,33.18587501236726],6],
                KY: [[-84.3880,33.7490],4.8],
                LA: [[-92.38621633967261,31.4644733109196],6],
                MD: [[-84.3880,33.7490],4.8],
                MS: [[-89.67786020291152,32.533319001829355],6],
                NC: [[-79.98982424872995,35.418474838855246],6],
                NJ: [[-84.3880,33.7490],4.8],
                OK: [[-84.3880,33.7490],4.8],
                SC: [[-81.44966631576285,34.443473851986155],6],
                TN: [[-84.09830961197325,35.48978594085894],6],
                TX: [[-95.22010835516924,31.530900584738106],6],
                VA: [[-84.3880,33.7490],4.8]
            }
        }

        // bind functions
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.updateYearSelection = this.updateYearSelection.bind(this);
        this.updatePredictionYearSelection = this.updatePredictionYearSelection.bind(this);
        this.updateStateSelection = this.updateStateSelection.bind(this);
        this.updateNationalForestSelection = this.updateNationalForestSelection.bind(this);
        this.updateForestSelection = this.updateForestSelection.bind(this);
        this.updateCurrentData = this.updateCurrentData.bind(this);
        this.clearCurrentData = this.clearCurrentData.bind(this);
        this.getHistoricalData = this.getHistoricalData.bind(this);
        this.updateAvailableNationalForestsAndForests = this.updateAvailableNationalForestsAndForests.bind(this);
        this.runModel = this.runModel.bind(this);
        this.resetModelSelections = this.resetModelSelections.bind(this);
        this.getCustomModelOutputs = this.getCustomModelOutputs.bind(this);
        this.averageModelOutputs = this.averageModelOutputs.bind(this);
        this.updateSPBSelection = this.updateSPBSelection.bind(this);
        this.updateCleridst1Selection = this.updateCleridst1Selection.bind(this);
        this.updateSpotst1Selection = this.updateSpotst1Selection.bind(this);
        this.updateSpotst2Selection = this.updateSpotst2Selection.bind(this);
        this.handleModelForestClick = this.handleModelForestClick.bind(this);

        // set cookies
        this.setCookie("stateName", this.state.userFilters.stateName, 365);
        this.setCookie("stateAbbreviation", this.state.userFilters.stateAbbreviation, 365);
        this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
        this.setCookie("forest", this.state.userFilters.forest, 365);
        this.setCookie("startDate", this.state.userFilters.startDate, 365);
        this.setCookie("endDate", this.state.userFilters.endDate, 365);
    }

    render() {
        return null;
    }

    componentWillMount() {
        // hold onto url we are using to get the data
        this.setState({
            url: this.props.url
        }, () => {
            // if didn't have cookie for start or end date, set the start and end date
            if (this.state.userFilters.startDate === Infinity || this.state.userFilters.endDate === 0) {
                this.resetStartAndEndDate();
            }
    
            // initialize drop-down-menu options
            this.initializeAvailableStates();
            this.initializeAvailableNationalForests();
            this.initializeAvailableLocalForests();
            this.initializeAvailableYears(); // calls updateCurrentData when complete

            // get initial dates
            this.getOriginalStartDate();
            this.getOriginalEndDate();
        });

        // before the user closes the tab, save cookies one last time
        window.addEventListener("beforeunload", (ev) => {  
            this.setCookie("stateName", this.state.userFilters.stateName, 365);
            this.setCookie("stateAbbreviation", this.state.userFilters.stateAbbreviation, 365);
            this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
            this.setCookie("forest", this.state.userFilters.forest, 365);
            this.setCookie("startDate", this.state.userFilters.startDate, 365);
            this.setCookie("endDate", this.state.userFilters.endDate, 365);
            this.setCookie("predictiveModelDate", this.state.userFilters.predictiveModelDate, 365);
        });
    }

    // query data from database using given filters
    getHistoricalData(filters) {
        var url = this.state.url + "getHistoricalsFilter";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // sort data based on year
                 var sortedData = xmlHttp.response.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0));

                 // update currentData
                 var historicalData = Object.assign({}, this.state.historicalData);
                 historicalData.currentData = sortedData

                 this.setState({
                     historicalData: historicalData
                 }, () => {
                     this.updateAvailableNationalForestsAndForests();
                 });
             }
         }.bind(this);

         xmlHttp.open("POST", url, true);
         xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
         xmlHttp.responseType = 'json';
         xmlHttp.send(jQuery.param(filters));
    }

    // construct filters to be passed to API -- param is boolean for if setting filters for the model or not
    setQueryFilters(predictiveModel) {
        // if we are running this on the predictive model, filter on the date the user wants to run the model on
        if (predictiveModel) {
            var filters = {
                targetYear: this.state.userFilters.predictiveModelDate
            }
        }
        // filter on start date and end date
        else {
            var filters = {
                startDate: this.state.userFilters.startDate,
                endDate: this.state.userFilters.endDate
            }
        }

        // filter on state if the user has selected one
        if (this.state.userFilters.stateName !== null && this.state.userFilters.stateName !== "" && this.state.userFilters.stateAbbreviation !== null && this.state.userFilters.stateAbbreviation !== "") {
            filters.state = this.state.userFilters.stateAbbreviation;
        }

        // fitler on national forest if the user has selected one
        if (this.state.userFilters.nationalForest !== null && this.state.userFilters.nationalForest !== "") {
            filters.nf = this.state.userFilters.nationalForest;
        }

        // filter on forest if the user has selected one
        if (this.state.userFilters.forest !== null && this.state.userFilters.forest !== "") {
            filters.forest = this.state.userFilters.forest;
        }

        return filters
    }

    getOriginalStartDate() {
        var url = this.state.url + "getMinimumYear";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                 // update userFilters
                 var userFilters = Object.assign({}, this.state.userFilters);
                 userFilters.originalStartDate = parseInt(xmlHttp.response)

                 // set the state
                 this.setState({
                     userFilters: userFilters
                 });
             }
         }.bind(this);

         xmlHttp.open("GET", url, true);
         xmlHttp.responseType = 'json';
         xmlHttp.send();
    }

    getOriginalEndDate() {
        var url = this.state.url + "getMaximumYear";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                // update userFilters
                var userFilters = Object.assign({}, this.state.userFilters);
                userFilters.originalEndDate = parseInt(xmlHttp.response)
                 
                 // set the state
                 this.setState({
                     userFilters: userFilters
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });
                 });
             }
         }.bind(this);

         xmlHttp.open("GET", url, true);
         xmlHttp.responseType = 'json';
         xmlHttp.send();
    }

    // add input option fields for state selection
    initializeAvailableStates() {
        var url = this.state.url + "getUniqueStates";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // get state names
                 var stateNames = []

                 for (var state in xmlHttp.response) {
                     var stateAbbrev = xmlHttp.response[state]
                     stateNames.push(this.state.stateAbbrevToStateName[stateAbbrev]);
                 }

                 // update dropDownContent
                 var dropDownContent = Object.assign({}, this.state.dropDownContent);
                 dropDownContent.availableStates = stateNames

                // update state
                this.setState({
                    dropDownContent: dropDownContent
                }, () => {
                    // set state of parent
                    this.props.parent.setState({
                        dataControllerState: this.state
                    });
                });
             }
             // if the request failed, clear the data and notify the user
             else {
                 // update dropDownContent
                 var dropDownContent = Object.assign({}, this.state.dropDownContent);
                 dropDownContent.availableStates = []

                // update state
                this.setState({
                    dropDownContent: dropDownContent
                }, () => {
                    // set state of parent
                    this.props.parent.setState({
                        dataControllerState: this.state
                    });
                });
             }
         }.bind(this);

         xmlHttp.open("GET", url, true);
         xmlHttp.responseType = 'json';
         xmlHttp.send();
    }

    // add input option fields for national forest selection
    initializeAvailableNationalForests() {
        if (this.state.userFilters.stateAbbreviation !== null) {
            var filters = {
                stateAbbreviation: this.state.userFilters.stateAbbreviation
            }
            var url = this.state.url + "getUniqueNationalForests";
            var xmlHttp = new XMLHttpRequest();

            xmlHttp.onload = function() {
                // if the request was successful hold onto the data
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                    // update dropDownContent
                    var dropDownContent = Object.assign({}, this.state.dropDownContent);
                    dropDownContent.availableNationalForests = xmlHttp.response

                    // update state
                    this.setState({
                        dropDownContent: dropDownContent
                    }, () => {
                        // set state of parent
                        this.props.parent.setState({
                            dataControllerState: this.state
                        });
                    });
                }
                // if the request failed, clear the data and notify the user
                else {
                    // update dropDownContent
                    var dropDownContent = Object.assign({}, this.state.dropDownContent);
                    dropDownContent.availableNationalForests = []

                    // update state
                    this.setState({
                        dropDownContent: dropDownContent
                    }, () => {
                        // set state of parent
                        this.props.parent.setState({
                            dataControllerState: this.state
                        });
                    });
                }
            }.bind(this);

            xmlHttp.open("POST", url, true);
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.responseType = 'json';
            xmlHttp.send(jQuery.param(filters));
        }
    }

    // add input option fields for local forest selection
    initializeAvailableLocalForests() {
        if (this.state.userFilters.stateAbbreviation !== null) {
            var filters = {
                stateAbbreviation: this.state.userFilters.stateAbbreviation
            }
            var url = this.state.url + "getUniqueLocalForests";
            var xmlHttp = new XMLHttpRequest();

            xmlHttp.onload = function() {
                // if the request was successful hold onto the data
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                    // update dropDownContent
                    var dropDownContent = Object.assign({}, this.state.dropDownContent);
                    dropDownContent.availableLocalForests = xmlHttp.response

                    // update state
                    this.setState({
                        dropDownContent: dropDownContent
                    }, () => {
                        // set state of parent
                        this.props.parent.setState({
                            dataControllerState: this.state
                        });
                    });
                }
                // if the request failed, clear the data and notify the user
                else {
                    // update dropDownContent
                    var dropDownContent = Object.assign({}, this.state.dropDownContent);
                    dropDownContent.availableLocalForests = []

                    // update state
                    this.setState({
                        dropDownContent: dropDownContent
                    }, () => {
                        // set state of parent
                        this.props.parent.setState({
                            dataControllerState: this.state
                        });
                    });
                }
            }.bind(this);

            xmlHttp.open("POST", url, true);
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.responseType = 'json';
            xmlHttp.send(jQuery.param(filters));
        }
    }

    // add input option fields for year selection
    initializeAvailableYears() {
        var url = this.state.url + "getUniqueYears";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                 // update dropDownContent
                 var dropDownContent = Object.assign({}, this.state.dropDownContent);
                 dropDownContent.availableYears = xmlHttp.response;
                 dropDownContent.availableModelYears = xmlHttp.response;
                 dropDownContent.availableModelYears.push(dropDownContent.availableYears[dropDownContent.availableYears.length - 1] + 1);

                 // update state
                 this.setState({
                     dropDownContent: dropDownContent
                 }, () => {
                    // send query to database for data -- once this is complete, DataController will mount and send its state back to App, App then sends DataController to child components
                    this.updateCurrentData();

                    if (this.state.userFilters.forest !== null || this.state.userFilters.nf !== null) {
                        this.runModel();
                    }

                    // set state of parent
                    this.props.parent.setState({
                        dataControllerState: this.state
                    });
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 // update dropDownContent
                 var dropDownContent = Object.assign({}, this.state.dropDownContent);
                 dropDownContent.availableYears = []

                 // update state
                 this.setState({
                     dropDownContent: dropDownContent
                 }, () => {
                    if (this.state.userFilters.forest !== null || this.state.userFilters.nf !== null) {
                        this.runModel();
                    }

                    // set state of parent
                    this.props.parent.setState({
                        dataControllerState: this.state
                    });
                 });
             }
         }.bind(this);

         xmlHttp.open("GET", url, true);
         xmlHttp.responseType = 'json';
         xmlHttp.send();
    }

    // update the start and end dates for the available data
    resetStartAndEndDate() {
        // update userFilters
        var userFilters = Object.assign({}, this.state.userFilters);
        userFilters.startDate = this.state.userFilters.originalStartDate
        userFilters.endDate = this.state.userFilters.originalEndDate

        this.setState({
            userFilters: userFilters
        }, () => {
            // set cookies
            this.setCookie("startDate", this.state.userFilters.startDate, 365);
            this.setCookie("endDate", this.state.userFilters.endDate, 365);

            // update current data
            this.updateCurrentData();

            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            });
        });
    }

    // update start date and ensure requested date is available
    updateStartDate(date) {
        // so long as the newly requested date isn't before minDate and is before end date, update state
        if (date >= this.state.userFilters.originalStartDate && date <= this.state.userFilters.endDate) {
            // update userFilters
            var userFilters = Object.assign({}, this.state.userFilters);
            userFilters.startDate = date

            this.setState({
                userFilters: userFilters
            }, () => {
                // set cookies
                this.setCookie("startDate", this.state.userFilters.startDate, 365);

                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
    }

    // update end date and ensure requested date is available
    updateEndDate(date) {
        // so long as the newly requested date isn't after maxDate and is after start date, update state
        if (date <= this.state.userFilters.originalEndDate && date >= this.state.userFilters.startDate) {
            // update userFilters
            var userFilters = Object.assign({}, this.state.userFilters);
            userFilters.endDate = date

            this.setState({
                userFilters: userFilters
            }, () => {
                // set cookies
                this.setCookie("endDate", this.state.userFilters.endDate, 365);

                // update current data
                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
    }

    updateYearSelection(year) {
        // update userFilters
        var userFilters = Object.assign({}, this.state.userFilters);
        userFilters.startDate = year
        userFilters.endDate = year

        this.setState({
            userFilters: userFilters
        }, () => {
            // set cookies
            this.setCookie("startDate", this.state.userFilters.startDate, 365);
            this.setCookie("endDate", this.state.userFilters.endDate, 365);

            // update current data
            this.updateCurrentData();

            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            });
        });
    }

    // set the year we are running the predictive model on
    updatePredictionYearSelection(year) {    
        // update userFilters
        var userFilters = Object.assign({}, this.state.userFilters);
        userFilters.predictiveModelDate = year;

        this.setState({
            userFilters: userFilters,
            updatedStateSelection: true
        }, () => {
            // set cookies
            this.setCookie("predictiveModelDate", this.state.userFilters.predictiveModelDate, 365);

            // run the R model
            this.runModel();

            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            });
        });
    }

    // select a new state -- control for if we are passed an abbreviation or a state name
    updateStateSelection(state) {
        // copy userFilters
        var userFilters = Object.assign({}, this.state.userFilters);

        // if the user wants to clear the state selection, set to null
        if (state === null) {
            userFilters.stateName = null
            userFilters.stateAbbreviation = null
            userFilters.nationalForest = null
            userFilters.forest = null
    
            this.setState({
                userFilters: userFilters
            }, () => {
                // set cookies
                this.setCookie("stateName", this.state.userFilters.stateName, 365);
                this.setCookie("stateAbbreviation", this.state.userFilters.stateAbbreviation, 365);
                this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
                this.setCookie("forest", this.state.userFilters.forest, 365);

                // update current data
                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        // if we were given a state name and not the abbreviation, we need to get its abbreviation
        if (state.length > 2) {
            // search through map of state abbreviations to names to grab the correct one
            for (var abbrev in this.state.stateAbbrevToStateName) {
                if (this.state.stateAbbrevToStateName[abbrev] === state) {
                    userFilters.stateName = state
                    userFilters.stateAbbreviation = abbrev
                    userFilters.nationalForest = null
                    userFilters.forest = null

                    this.setState({
                        userFilters: userFilters,
                        updatedStateSelection: true
                    }, () => {
                        // set cookies
                        this.setCookie("stateName", this.state.userFilters.stateName, 365);
                        this.setCookie("stateAbbreviation", this.state.userFilters.stateAbbreviation, 365);
                        this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
                        this.setCookie("forest", this.state.userFilters.forest, 365);

                        // update current data
                        this.updateCurrentData();

                        // set state of parent
                        this.props.parent.setState({
                            dataControllerState: this.state
                        });
                    });
                }
            }
        }
        // if we were given the state ID, select based on that
        else if (state.length === 2 && typeof parseInt(state) === "number") {
            // search through map of state abbreviations to names to grab the correct one
            for (var abbrev in this.state.stateAbbrevToStateID) {
                if (this.state.stateAbbrevToStateID[abbrev] === state) {
                    userFilters.stateName = this.state.stateAbbrevToStateName[abbrev];
                    userFilters.stateAbbreviation = abbrev;
                    userFilters.nationalForest = null;
                    userFilters.forest = null;

                    this.setState({
                        userFilters: userFilters,
                        updatedStateSelection: true
                    }, () => {
                        // set cookies
                        this.setCookie("stateName", this.state.userFilters.stateName, 365);
                        this.setCookie("stateAbbreviation", this.state.userFilters.stateAbbreviation, 365);
                        this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
                        this.setCookie("forest", this.state.userFilters.forest, 365);

                        // update current data
                        this.updateCurrentData();

                        // set state of parent
                        this.props.parent.setState({
                            dataControllerState: this.state
                        });
                    });
                }
            }
        }
        // if we were given the abbreviation and not the name, get the name
        else {
            // search through map of state abbreviations to names to grab the correct one
            for (abbrev in this.state.stateAbbrevToStateName) {
                if (abbrev === state) {
                    userFilters.stateName = this.state.stateAbbrevToStateName[abbrev];
                    userFilters.stateAbbreviation = abbrev;
                    userFilters.nationalForest = null;
                    userFilters.forest = null;

                    this.setState({
                        userFilters: userFilters,
                        updatedStateSelection: true
                    }, () => {
                        // set cookies
                        this.setCookie("stateName", this.state.userFilters.stateName, 365);
                        this.setCookie("stateAbbreviation", this.state.userFilters.stateAbbreviation, 365);
                        this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
                        this.setCookie("forest", this.state.userFilters.forest, 365);

                        // update current data
                        this.updateCurrentData();

                        // set state of parent
                        this.props.parent.setState({
                            dataControllerState: this.state
                        });
                    });
                }
            }
        }
    }

    // update national forest selection -- clear forest if we are switching selections
    updateNationalForestSelection(nationalForest) {
        // if we are going from a null selection to a new selection, just update national forest
        if (this.state.userFilters.nationalForest === null) {
            var userFilters = Object.assign({}, this.state.userFilters);
            userFilters.nationalForest = nationalForest;

            this.setState({
                userFilters: userFilters
            }, () => {
                // set cookies
                this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);

                // update current data
                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        // if we are going from a non-null selection to a new selection, clear local forest
        else {
            var userFilters = Object.assign({}, this.state.userFilters);
            userFilters.nationalForest = nationalForest;
            userFilters.forest = null;

            this.setState({
                userFilters: userFilters
            }, () => {
                // set cookies
                this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
                this.setCookie("forest", this.state.userFilters.forest, 365);

                // update current data
                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
    }

    // update forest selection -- clear national forest if we are switching selections
    updateForestSelection(forest) {
        // if we are going from a null selection to a new selection, just update forest
        if (this.state.userFilters.forest === null) {
            var userFilters = Object.assign({}, this.state.userFilters);
            userFilters.forest = forest;

            this.setState({
                userFilters: userFilters
            }, () => {
                // set cookies
                this.setCookie("forest", this.state.userFilters.forest, 365);

                // update current data
                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        // if we are going from a non-null selection to a new selection, clear national forest
        else {
            var userFilters = Object.assign({}, this.state.userFilters);
            userFilters.forest = forest;
            userFilters.nationalForest = null;

            this.setState({
                userFilters: userFilters
            }, () => {
                // set cookies
                this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
                this.setCookie("forest", this.state.userFilters.forest, 365);

                // update current data
                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
    }

    // get data from database in a summarized format based on latitude and longitude
    updateSummarizedDataByLatLong() {
        var filters = this.setQueryFilters(false);
        var url = this.state.url + "getSummarizedDataByLatLongFilter";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                 var historicalData = Object.assign({}, this.state.historicalData);
                 historicalData.summarizedDataByLatLong = xmlHttp.response

                 // store result
                 this.setState({
                     historicalData: historicalData
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });

                     // update available drop-down items
                     this.updateAvailableNationalForestsAndForests();
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 var historicalData = Object.assign({}, this.state.historicalData);
                 historicalData.summarizedDataByLatLong = []

                 this.setState({
                     historicalData: historicalData
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });
                 });
             }
         }.bind(this);

         xmlHttp.open("POST", url, true);
         xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
         xmlHttp.responseType = 'json';
         xmlHttp.send(jQuery.param(filters));
    }

    // get data from database in a summarized format based on year
    updateSummarizedDataByYear() {
        var filters = this.setQueryFilters(false);
        var url = this.state.url + "getSummarizedDataByYearFilter";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                 // get response
                 var startDate = xmlHttp.response[0] !== null ? xmlHttp.response[0] : this.state.userFilters.startDate
                 var endDate = xmlHttp.response[1] !== null ? xmlHttp.response[1] : this.state.userFilters.endDate
                 var data = xmlHttp.response[2]

                 var userFilters = Object.assign({}, this.state.userFilters);
                 userFilters.startDate = startDate;
                 userFilters.endDate = endDate;

                 var historicalData = Object.assign({}, this.state.historicalData);
                 historicalData.summarizedDataByYear = data;

                 // store result
                 this.setState({
                     userFilters: userFilters,
                     historicalData: historicalData
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 var historicalData = Object.assign({}, this.state.historicalData);
                 historicalData.summarizedDataByYear = [];

                 this.setState({
                     historicalData: historicalData
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });
                 });
             }
         }.bind(this);

         xmlHttp.open("POST", url, true);
         xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
         xmlHttp.responseType = 'json';
         xmlHttp.send(jQuery.param(filters));
    }

    // update current data based on the user selections for state, forest, date, etc.
    updateCurrentData() {
        // get summarized data
        this.updateSummarizedDataByYear();
        this.updateSummarizedDataByLatLong(); // calls runModel after completion
    }

    runModel() {
        // if a state has been selected
        if (this.state.userFilters.stateAbbreviation !== null && this.state.userFilters.stateAbbreviation !== undefined && this.state.userFilters.stateAbbreviation !== "" && this.state.updatedStateSelection) {        
            this.averageModelOutputs();    
        }
        else {
            var inputs = {
                SPB: 0,
                cleridst1: 0,
                spotst1: 0,
                spotst2: 0
            }

            var outputs = {
                prob0spots: 0,
                prob19spots: 0,
                prob53spots: 0,
                prob147spots: 0,
                prob402spots: 0,
                prob1095spots: 0,
                expSpotsIfOutbreak: 0
            }

            // set the state
            this.setState({
                predictiveModelInputs: inputs,
                predictiveModelOutputs: outputs
            }, () => {
                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
    }

    resetModelSelections() {
        for (var i in this.state.predictiveModelOutputArray) {
            if (this.state.predictiveModelOutputArray[i].inputs.forest === this.state.userFilters.forest) {
                console.log(this.state.predictiveModelOutputArray[i])
                this.setState({
                    predictiveModelInputs: this.state.predictiveModelOutputArray[i].inputs,
                    predictiveModelOutputs: this.state.predictiveModelOutputArray[i].outputs
                }, () => {
                    // set state of parent
                    this.props.parent.setState({
                        dataControllerState: this.state
                    });
                });
            }
        }
    }

    // run the R model and store outputs -- call this when a state and nf/forest have been selected
    getModelOutputs() {
        this.setState({
            runningModel: true
        }, () => {
            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            }, () => {
                var url = this.state.url + "getPredictions";
                var xmlHttp = new XMLHttpRequest();
                var filters = this.setQueryFilters(true);

                xmlHttp.onload = function() {
                    // if the request was successful hold onto the data
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                        var modelOutputs = [{
                            inputs: xmlHttp.response.inputs,
                            outputs: xmlHttp.response.outputs
                        }];
        
                        // set the state
                        this.setState({
                            predictiveModelOutputArray: modelOutputs,
                            predictiveModelInputs: xmlHttp.response.inputs,
                            predictiveModelOutputs: xmlHttp.response.outputs,
                            runningModel: false,
                            updatedStateSelection: false
                        }, () => {
                            // set state of parent
                            this.props.parent.setState({
                                dataControllerState: this.state
                            });
                        });
                    }
                    // if the request failed, clear the data and notify the user
                    else {
        
                        var inputs = {
                            SPB: 0,
                            cleridst1: 0,
                            spotst1: 0,
                            spotst2: 0
                        }
        
                        var outputs = {
                            prob0spots: 0,
                            prob19spots: 0,
                            prob53spots: 0,
                            prob147spots: 0,
                            prob402spots: 0,
                            prob1095spots: 0,
                            expSpotsIfOutbreak: 0
                        }

                        var modelOutputs = [{
                            inputs: inputs,
                            outputs: outputs
                        }];
        
                        // set the state
                        this.setState({
                            predictiveModelOutputArray: modelOutputs,
                            predictiveModelInputs: inputs,
                            predictiveModelOutputs: outputs,
                            runningModel: false,
                            updatedStateSelection: false
                        }, () => {
                            // set state of parent
                            this.props.parent.setState({
                                dataControllerState: this.state
                            });
                        });
                    }
                }.bind(this);
        
                xmlHttp.open("POST", url, true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.responseType = 'json';
                xmlHttp.send(jQuery.param(filters));   
            });
        });
    }

    // run model on all forests in a state then average outputs -- run this when only a state has been selected (and not a forest/nf)
    averageModelOutputs() {
        this.setState({
            runningModel: true
        }, () => {
            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            }, () => {
                // construct an array of outputs from running the model as well as an array of promises
                var modelOutputs = [];
                var promises = [];

                // for each available forest, run the model and get the results
                this.state.dropDownContent.availableLocalForests.forEach(function(forest) {
                    var url = this.state.url + "getPredictions";
                    var filters = {
                        targetYear: this.state.userFilters.predictiveModelDate,
                        state: this.state.userFilters.stateAbbreviation,
                        forest: forest
                    }
                    promises.push(axios.post(url,filters))
                }.bind(this));

                // for each available national forest, run the model and get the results
                this.state.dropDownContent.availableNationalForests.forEach(function(forest) {
                    var url = this.state.url + "getPredictions";
                    var filters = {
                        targetYear: this.state.userFilters.predictiveModelDate,
                        state: this.state.userFilters.stateAbbreviation,
                        nf: forest
                    }
                    promises.push(axios.post(url,filters))
                }.bind(this));

                if (promises.length > 0) {
                    // once all the promises finish, store the outputs
                    axios.all(promises).then(function(results) {
                        // initialize outputs from predictive model
                        var predictiveModelOutputs = {
                            expSpotsIfOutbreak: 0,
                            prob0spots: 0,
                            prob19spots: 0,
                            prob53spots: 0,
                            prob147spots: 0,
                            prob402spots: 0,
                            prob1095spots: 0
                        }

                        // initialize inputs to predictive model
                        var predictiveModelInputs = {
                            SPB: 0,
                            cleridst1: 0,
                            spotst1: 0,
                            spotst2: 0,
                            endobrev: 1
                        }

                        results.forEach(function(response) {
                            // store total response
                            modelOutputs.push(response.data);

                            // sum outputs
                            predictiveModelOutputs.expSpotsIfOutbreak += response.data.outputs.expSpotsIfOutbreak;
                            predictiveModelOutputs.prob0spots += response.data.outputs.prob0spots;
                            predictiveModelOutputs.prob19spots += response.data.outputs.prob19spots;
                            predictiveModelOutputs.prob53spots += response.data.outputs.prob53spots;
                            predictiveModelOutputs.prob147spots += response.data.outputs.prob147spots;
                            predictiveModelOutputs.prob402spots += response.data.outputs.prob402spots;
                            predictiveModelOutputs.prob1095spots += response.data.outputs.prob1095spots;

                            // sum inputs
                            predictiveModelInputs.SPB += response.data.inputs.SPB;
                            predictiveModelInputs.cleridst1 += response.data.inputs.cleridst1;
                            predictiveModelInputs.spotst1 += response.data.inputs.spotst1;
                            predictiveModelInputs.spotst2 += response.data.inputs.spotst2;
                        });

                        // take averages
                        predictiveModelOutputs.expSpotsIfOutbreak = (predictiveModelOutputs.expSpotsIfOutbreak / modelOutputs.length);
                        predictiveModelOutputs.prob0spots = (predictiveModelOutputs.prob0spots / modelOutputs.length);
                        predictiveModelOutputs.prob19spots = (predictiveModelOutputs.prob19spots / modelOutputs.length);
                        predictiveModelOutputs.prob53spots = (predictiveModelOutputs.prob53spots / modelOutputs.length);
                        predictiveModelOutputs.prob147spots = (predictiveModelOutputs.prob147spots / modelOutputs.length);
                        predictiveModelOutputs.prob402spots = (predictiveModelOutputs.prob402spots / modelOutputs.length);
                        predictiveModelOutputs.prob1095spots = (predictiveModelOutputs.prob1095spots / modelOutputs.length);

                        predictiveModelInputs.SPB = (predictiveModelInputs.SPB / modelOutputs.length);
                        predictiveModelInputs.cleridst1 = (predictiveModelInputs.cleridst1 / modelOutputs.length);
                        predictiveModelInputs.spotst1 = (predictiveModelInputs.spotst1 / modelOutputs.length);
                        predictiveModelInputs.spotst2 = (predictiveModelInputs.spotst2 / modelOutputs.length);

                        var setInputs = predictiveModelInputs;
                        var setOutputs = predictiveModelOutputs;

                        if (this.state.userFilters.forest !== null) {
                            for (var i in modelOutputs) {
                                if (modelOutputs[i].inputs.forest === this.state.userFilters.forest) {
                                    setInputs = modelOutputs[i].inputs;
                                    setOutputs = modelOutputs[i].outputs;
                                }
                            }
                        }

                        this.setState({
                            predictiveModelOutputArray: modelOutputs,
                            predictiveModelOutputs: setOutputs,
                            predictiveModelInputs: setInputs,
                            runningModel: false,
                            updatedStateSelection: false
                        }, () => {
                            // set state of parent
                            this.props.parent.setState({
                                dataControllerState: this.state
                            });
                        });
                    }.bind(this));
                }
                else {
                    // initialize outputs from predictive model
                    var predictiveModelOutputs = {
                        expSpotsIfOutbreak: 6.394,
                        prob0spots: 0.114,
                        prob19spots: 0.043,
                        prob53spots: 0.019,
                        prob147spots: 0.007,
                        prob402spots: 0.002,
                        prob1095spots: 0.001
                    }

                    // initialize inputs to predictive model
                    var predictiveModelInputs = {
                        SPB: 0,
                        cleridst1: 0,
                        spotst1: 0,
                        spotst2: 0,
                        endobrev: 1
                    }

                    this.setState({
                        predictiveModelOutputArray: [],
                        predictiveModelOutputs: predictiveModelOutputs,
                        predictiveModelInputs: predictiveModelInputs,
                        runningModel: false,
                        updatedStateSelection: false
                    }, () => {
                        // set state of parent
                        this.props.parent.setState({
                            dataControllerState: this.state
                        });
                    });
                }
            });
        });
    }

    // run the R model and store outputs -- run this when the user puts custom model inputs in
    getCustomModelOutputs() {
        this.setState({
            runningModel: true
        }, () => {
            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            }, () => {

                var url = this.state.url + "getCustomPredictions";
                var xmlHttp = new XMLHttpRequest();
                var filters = this.state.predictiveModelInputs;

                xmlHttp.onload = function() {
                    // if the request was successful hold onto the data
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                        // set the state
                        this.setState({
                            predictiveModelOutputs: xmlHttp.response,
                            runningModel: false,
                            updatedStateSelection: false
                        }, () => {
                            // set state of parent
                            this.props.parent.setState({
                                dataControllerState: this.state
                            });
                        });
                    }
                    // if the request failed, clear the data and notify the user
                    else {

                        var outputs = {
                            prob0spots: 0,
                            prob19spots: 0,
                            prob53spots: 0,
                            prob147spots: 0,
                            prob402spots: 0,
                            prob1095spots: 0,
                            expSpotsIfOutbreak: 0
                        }

                        // set the state
                        this.setState({
                            predictiveModelOutputs: outputs,
                            runningModel: false,
                            updatedStateSelection: false
                        }, () => {
                            // set state of parent
                            this.props.parent.setState({
                                dataControllerState: this.state
                            });
                        });
                    }
                }.bind(this);

                xmlHttp.open("POST", url, true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.responseType = 'json';
                xmlHttp.send(jQuery.param(filters));
            });
        });
    }

    // set new model input value for spb
    updateSPBSelection(value) {
        var predictiveModelInputs = Object.assign({}, this.state.predictiveModelInputs);
        predictiveModelInputs.SPB = parseInt(value);

        this.setState({
            predictiveModelInputs: predictiveModelInputs
        }, () => {
            this.getCustomModelOutputs();
        });
    }

    // set new model input value for cleridst1
    updateCleridst1Selection(value) {
        var predictiveModelInputs = Object.assign({}, this.state.predictiveModelInputs);
        predictiveModelInputs.cleridst1 = parseInt(value);

        this.setState({
            predictiveModelInputs: predictiveModelInputs
        }, () => {
            this.getCustomModelOutputs();
        });
    }

    // set new model input value for spotst1
    updateSpotst1Selection(value) {
        var predictiveModelInputs = Object.assign({}, this.state.predictiveModelInputs);
        predictiveModelInputs.spotst1 = parseInt(value);

        this.setState({
            predictiveModelInputs: predictiveModelInputs
        }, () => {
            this.getCustomModelOutputs();
        });
    }

    // set new model input value for spotst2
    updateSpotst2Selection(value) {
        var predictiveModelInputs = Object.assign({}, this.state.predictiveModelInputs);
        predictiveModelInputs.spotst2 = parseInt(value);

        this.setState({
            predictiveModelInputs: predictiveModelInputs
        }, () => {
            this.getCustomModelOutputs();
        });
    }

    handleModelForestClick(e) {
        e.persist();
        this.updateForestSelection(e.target.textContent)
    }

    // after the state has been updated, also update available forests and national forests
    updateAvailableNationalForestsAndForests() {
        var availableNationalForests = [];
        var availableLocalForests = [];

        if (this.state.userFilters.stateName !== null && this.state.userFilters.stateAbbreviation !== null) {
            for (var obj in this.state.historicalData.summarizedDataByLatLong) {
                // grab national forest and local forests
                var thisNF = this.state.historicalData.summarizedDataByLatLong[obj].nf;
                var thisForest = this.state.historicalData.summarizedDataByLatLong[obj].forest;

                // add to arrays
                if (!availableNationalForests.includes(thisNF) && thisNF !== "") {
                    availableNationalForests.push(thisNF);
                }
                if (!availableLocalForests.includes(thisForest) && thisForest !== "") {
                    availableLocalForests.push(thisForest);
                }
            }
        }

        // if neither national forest or local forest is selected, update both
        if (this.state.userFilters.nationalForest === null && this.state.userFilters.forest === null) {

            var dropDownContent = Object.assign({}, this.state.dropDownContent);
            dropDownContent.availableNationalForests = availableNationalForests;
            dropDownContent.availableLocalForests = availableLocalForests;

            this.setState({
                dropDownContent: dropDownContent
            }, () => {
                this.runModel();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        // if only local forest is unselected, update it
        else if (this.state.userFilters.nationalForest !== null && this.state.userFilters.forest === null) {
            var dropDownContent = Object.assign({}, this.state.dropDownContent);
            dropDownContent.availableLocalForests = availableLocalForests;

            var inputs = {
                SPB: 0,
                cleridst1: 0,
                spotst1: 0,
                spotst2: 0
            };
            var outputs = {
                expSpotsIfOutbreak: 0,
                prob0spots: 0,
                prob19spots: 0,
                prob53spots: 0,
                prob147spots: 0,
                prob402spots: 0,
                prob1095spots: 0
            };

            for (var i in this.state.predictiveModelOutputArray) {
                if (this.state.predictiveModelOutputArray[i].inputs.forest === this.state.userFilters.forest) {
                    inputs = this.state.predictiveModelOutputArray[i].inputs;
                    outputs = this.state.predictiveModelOutputArray[i].outputs;
                }
            }

            this.setState({
                dropDownContent: dropDownContent,
                predictiveModelInputs: inputs,
                predictiveModelOutputs: outputs
            }, () => {

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        // if only national forest is unselected, update it
        else if (this.state.userFilters.nationalForest === null && this.state.userFilters.forest !== null) {
            var dropDownContent = Object.assign({}, this.state.dropDownContent);
            dropDownContent.availableNationalForests = availableNationalForests;

            var inputs = {
                SPB: 0,
                cleridst1: 0,
                spotst1: 0,
                spotst2: 0
            };
            var outputs = {
                expSpotsIfOutbreak: 0,
                prob0spots: 0,
                prob19spots: 0,
                prob53spots: 0,
                prob147spots: 0,
                prob402spots: 0,
                prob1095spots: 0
            };

            for (var i in this.state.predictiveModelOutputArray) {
                if (this.state.predictiveModelOutputArray[i].inputs.forest === this.state.userFilters.forest) {
                    inputs = this.state.predictiveModelOutputArray[i].inputs;
                    outputs = this.state.predictiveModelOutputArray[i].outputs;
                }
            }

            this.setState({
                dropDownContent: dropDownContent,
                predictiveModelInputs: inputs,
                predictiveModelOutputs: outputs
            }, () => {

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        else {
            var inputs = {
                SPB: 0,
                cleridst1: 0,
                spotst1: 0,
                spotst2: 0
            };
            var outputs = {
                expSpotsIfOutbreak: 0,
                prob0spots: 0,
                prob19spots: 0,
                prob53spots: 0,
                prob147spots: 0,
                prob402spots: 0,
                prob1095spots: 0
            };

            for (var i in this.state.predictiveModelOutputArray) {
                if (this.state.predictiveModelOutputArray[i].inputs.forest === this.state.userFilters.forest) {
                    inputs = this.state.predictiveModelOutputArray[i].inputs;
                    outputs = this.state.predictiveModelOutputArray[i].outputs;
                }
            }

            this.setState({
                predictiveModelInputs: inputs,
                predictiveModelOutputs: outputs
            }, () => {
                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
    }

    // set current to total and update menus/dropdowns
    clearCurrentData() {
        var userFilters = Object.assign({}, this.state.userFilters);
        userFilters.stateName = null;
        userFilters.stateAbbreviation = null;
        userFilters.nationalForest = null;
        userFilters.forest = null;
        userFilters.startDate = this.state.userFilters.originalStartDate;
        userFilters.endDate = this.state.userFilters.originalEndDate;
        userFilters.predictiveModelDate = this.state.dropDownContent.availableModelYears[this.state.dropDownContent.availableModelYears.length - 1];

        var historicalData = Object.assign({}, this.state.historicalData);
        historicalData.currentData = [];

        var dropDownContent = Object.assign({}, this.state.dropDownContent);
        dropDownContent.availableNationalForests = [];
        dropDownContent.availableLocalForests = [];

        this.setState({
            userFilters: userFilters,
            historicalData: historicalData,
            dropDownContent: dropDownContent
        }, () => {
            // set cookies
            this.setCookie("stateName", this.state.userFilters.stateName, 365);
            this.setCookie("stateAbbreviation", this.state.userFilters.stateAbbreviation, 365);
            this.setCookie("nationalForest", this.state.userFilters.nationalForest, 365);
            this.setCookie("forest", this.state.userFilters.forest, 365);
            this.setCookie("startDate", this.state.userFilters.startDate, 365);
            this.setCookie("endDate", this.state.userFilters.endDate, 365);

            // reset our original start and ending dates (calls updateCurrentData)
            this.resetStartAndEndDate();

            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            });
        });
    }

    // source: https://www.w3schools.com/js/js_cookies.asp
      setCookie(cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays*24*60*60*1000));
          var expires = "expires="+ d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

      // source: https://www.w3schools.com/js/js_cookies.asp
      getCookie(cname) {
          var name = cname + "=";
          var decodedCookie = decodeURIComponent(document.cookie);
          var ca = decodedCookie.split(';');
          for(var i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) === ' ') {
                  c = c.substring(1);
              }
              if (c.indexOf(name) === 0) {
                  return c.substring(name.length, c.length);
              }
          }
          return null;
      }
}

export default DataController