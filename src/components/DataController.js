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
        var startDate = (this.getCookie("startDate") !== null && this.getCookie("startDate") !== "null") ? this.getCookie("startDate") : Infinity;
        var endDate = (this.getCookie("endDate") !== null && this.getCookie("endDate") !== "null") ? this.getCookie("endDate") : 0;
        var predictiveModelDate = (this.getCookie("predictiveModelDate") !== null && this.getCookie("predictiveModelDate") !== "null") ? this.getCookie("predictiveModelDate") : 0;

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
            },

            // arrays of JSON data loaded from database
            historicalData: {
                currentData: [],
                summarizedDataByLatLong: null,
                summarizedDataByYear: null
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

            url: ""
        }

        // map of state abbreviations to their names
        this.stateAbbrevToStateName = {
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
            // send query to database (begin the process immediately -- once this is complete, DataController will mount and send its state back to App, App then sends DataController to child components
            this.updateCurrentData();

            // get initial dates
            this.getOriginalStartDate();
            this.getOriginalEndDate();
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
                 userFilters.predictiveModelDate = parseInt(xmlHttp.response)

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

    // update start and end dates initially available to user, hold onto original dates, initialize the state drop-down menu
    componentDidMount() {
        // if didn't have cookie for start or end date, set the start and end date
        if (this.state.userFilters.startDate === Infinity || this.state.userFilters.endDate === 0) {
            this.resetStartAndEndDate();
        }

        // initialize drop-down-menu options
        this.initializeAvailableStates();
        this.initializeAvailableNationalForests();
        this.initializeAvailableLocalForests();
        this.initializeAvailableYears();
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
                     stateNames.push(this.stateAbbrevToStateName[stateAbbrev]);
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
        var filters = this.setQueryFilters(false);
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
         xmlHttp.send(filters);
    }

    // add input option fields for local forest selection
    initializeAvailableLocalForests() {
        var filters = this.setQueryFilters(false);
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
         xmlHttp.send(filters);
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
                 dropDownContent.availableYears = xmlHttp.response

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
        // update userFilters
        var userFilters = Object.assign({}, this.state.userFilters);
        userFilters.predictiveModelDate = year

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
            for (var abbrev in this.stateAbbrevToStateName) {
                if (this.stateAbbrevToStateName[abbrev] === state) {
                    userFilters.stateName = state
                    userFilters.stateAbbreviation = abbrev
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
            }
        }
        // if we were given the abbreviation and not the name, get the name
        else {
            // search through map of state abbreviations to names to grab the correct one
            for (abbrev in this.stateAbbrevToStateName) {
                if (abbrev === state) {
                    userFilters.stateName = this.stateAbbrevToStateName[abbrev];
                    userFilters.stateAbbreviation = abbrev;
                    userFilters.nationalForest = null;
                    userFilters.forest = null;

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

    // update current data based on the user selections for state, forest, date, etc.
    updateCurrentData() {
        // get summarized data
        this.updateSummarizedDataByYear();
        this.updateSummarizedDataByLatLong();
        this.getModelOutputs();
    }

    // run the R model and store outputs
    getModelOutputs() {
        var url = this.state.url + "getPredictions";
        var xmlHttp = new XMLHttpRequest();
        var filters = this.setQueryFilters(true);

        xmlHttp.onload = function() {
            // if the request was successful hold onto the data
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                var outputs = {
                    prob0spots: xmlHttp.response[0],
                    prob19spots: xmlHttp.response[1],
                    prob53spots: xmlHttp.response[2],
                    prob147spots: xmlHttp.response[3],
                    prob402spots: xmlHttp.response[4],
                    prob1095spots: xmlHttp.response[5],
                    expSpotsIfOutbreak: xmlHttp.response[6]
                }

                // set the state
                this.setState({
                    predictiveModelOutputs: outputs
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
                });
            }
        }.bind(this);

        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.responseType = 'json';
        xmlHttp.send(jQuery.param(filters));
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
            var dropDownContent = Object.assign({}, this.state.dropDownContent);
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
