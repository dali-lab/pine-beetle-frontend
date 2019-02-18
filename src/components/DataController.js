import { Component } from 'react';
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
                latestModelYear: false,
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
                summarizedDataByYear: null,
                summarizedDataByState: null
            },

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

            runningModel: false,
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
        this.getCustomModelOutputs = this.getCustomModelOutputs.bind(this);
        this.updateSPBSelection = this.updateSPBSelection.bind(this);
        this.updateCleridst1Selection = this.updateCleridst1Selection.bind(this);
        this.updateSpotst1Selection = this.updateSpotst1Selection.bind(this);
        this.updateSpotst2Selection = this.updateSpotst2Selection.bind(this);

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
            this.initializeAvailableYears();

            // send query to database (begin the process immediately -- once this is complete, DataController will mount and send its state back to App, App then sends DataController to child components
            this.updateCurrentData();

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
                 
                if (userFilters.predictiveModelDate - 1 === userFilters.originalEndDate && userFilters.stateAbbreviation === null) {
                    userFilters.latestModelYear = true;
                }
                else {
                    userFilters.latestModelYear = false;
                }

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

                 var userFilters = Object.assign({}, this.state.userFilters);

                 if (this.state.userFilters.predictiveModelDate === dropDownContent.availableModelYears[dropDownContent.availableModelYears.length - 1] && this.state.userFilters.state === null) {
                     userFilters.latestModelYear = true;
                 }
                 else {
                     userFilters.latestModelYear = false;
                 }

                 // update state
                 this.setState({
                     dropDownContent: dropDownContent,
                     userFilters: userFilters
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
                 dropDownContent.availableYears = []

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
        var latestModelYear = false;

        if (year - 1 === this.state.userFilters.originalEndDate && this.state.userFilters.stateAbbreviation === null) {
            latestModelYear = true;
        }
        
        // update userFilters
        var userFilters = Object.assign({}, this.state.userFilters);
        userFilters.predictiveModelDate = year;
        userFilters.latestModelYear = latestModelYear;

        this.setState({
            userFilters: userFilters
        }, () => {
            // set cookies
            this.setCookie("predictiveModelDate", this.state.userFilters.predictiveModelDate, 365);

            // update current data
            this.updateCurrentData();

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

            var latestModelYear = false;
            if (this.state.userFilters.predictiveModelDate - 1 === this.state.userFilters.originalEndDate) {
                latestModelYear = true;
            }
            userFilters.latestModelYear = latestModelYear
    
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
        else if (state.length > 2) {
            // search through map of state abbreviations to names to grab the correct one
            for (var abbrev in this.state.stateAbbrevToStateName) {
                if (this.state.stateAbbrevToStateName[abbrev] === state) {
                    userFilters.stateName = state
                    userFilters.stateAbbreviation = abbrev
                    userFilters.nationalForest = null
                    userFilters.forest = null
                    userFilters.latestModelYear = false;

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
                    userFilters.latestModelYear = false;

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
                    userFilters.latestModelYear = false;

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

    // get data from database in a summarized format based on latitude and longitude
    getSummarizedDataByState() {
        var filters = this.setQueryFilters(true);
        var url = this.state.url + "getSummarizedDataByState";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                 var historicalData = Object.assign({}, this.state.historicalData);
                 var response = xmlHttp.response;

                 var max = 0;

                 for (var entry in response) {
                     response[entry].STATE_ID = this.state.stateAbbrevToStateID[response[entry].state];

                     if (response[entry].spots > max) {
                         max = response[entry].spots
                     }
                 }

                 historicalData.summarizedDataByState = response;
                 historicalData.maxSpotsByState = max;

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
                 historicalData = Object.assign({}, this.state.historicalData);
                 historicalData.summarizedDataByState = null

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
        this.updateSummarizedDataByLatLong();
        this.getSummarizedDataByState();
        this.getModelOutputs();
    }

    // run the R model and store outputs
    getModelOutputs() {
        this.setState({
            runningModel: true
        }, () => {
            var url = this.state.url + "getPredictions";
            var xmlHttp = new XMLHttpRequest();
            var filters = this.setQueryFilters(true);

            if (filters.state !== null && filters.state !== undefined && filters.state !== "") {
                xmlHttp.onload = function() {
                    // if the request was successful hold onto the data
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        
                        // set the state
                        this.setState({
                            predictiveModelInputs: xmlHttp.response.inputs,
                            predictiveModelOutputs: xmlHttp.response.outputs,
                            runningModel: false
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
                }.bind(this);
        
                xmlHttp.open("POST", url, true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.responseType = 'json';
                xmlHttp.send(jQuery.param(filters));
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
        });
    }

    // run the R model and store outputs
    getCustomModelOutputs() {
        var url = this.state.url + "getCustomPredictions";
        var xmlHttp = new XMLHttpRequest();
        var filters = this.state.predictiveModelInputs;

        xmlHttp.onload = function() {
            // if the request was successful hold onto the data
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                // set the state
                this.setState({
                    predictiveModelOutputs: xmlHttp.response
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
                    predictiveModelOutputs: outputs
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

    // set new model input value for spb
    updateSPBSelection(value) {
        var predictiveModelInputs = Object.assign({}, this.state.predictiveModelInputs);
        predictiveModelInputs.SPB = value;

        this.setState({
            predictiveModelInputs: predictiveModelInputs
        }, () => {
            this.getCustomModelOutputs();
        });
    }

    // set new model input value for cleridst1
    updateCleridst1Selection(value) {
        var predictiveModelInputs = Object.assign({}, this.state.predictiveModelInputs);
        predictiveModelInputs.cleridst1 = value;

        this.setState({
            predictiveModelInputs: predictiveModelInputs
        }, () => {
            this.getCustomModelOutputs();
        });
    }

    // set new model input value for spotst1
    updateSpotst1Selection(value) {
        var predictiveModelInputs = Object.assign({}, this.state.predictiveModelInputs);
        predictiveModelInputs.spotst1 = value;

        this.setState({
            predictiveModelInputs: predictiveModelInputs
        }, () => {
            this.getCustomModelOutputs();
        });
    }

    // set new model input value for spotst2
    updateSpotst2Selection(value) {
        var predictiveModelInputs = Object.assign({}, this.state.predictiveModelInputs);
        predictiveModelInputs.spotst2 = value;

        this.setState({
            predictiveModelInputs: predictiveModelInputs
        }, () => {
            this.getCustomModelOutputs();
        });
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

            this.setState({
                dropDownContent: dropDownContent
            }, () => {
                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        // if only national forest is unselected, update it
        else if (this.state.userFilters.nationalForest === null && this.state.userFilters.forest !== null) {
            dropDownContent = Object.assign({}, this.state.dropDownContent);
            dropDownContent.availableNationalForests = availableNationalForests;

            this.setState({
                dropDownContent: dropDownContent
            }, () => {
                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        else {
            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
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
        userFilters.latestModelYear = true;

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
