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

        // set state based off cookies
        this.state = {
            stateName: stateName,
            stateAbbreviation: stateAbbreviation,
            nationalForest: nationalForest,
            forest: forest,
            startDate: startDate,
            endDate: endDate,
            originalStartDate: null,
            originalEndDate: null,

            availableStates: [],
            availableLocalForests: [],
            availableNationalForests: [],
            availableYears: [],

            totalData: [],
            currentData: [],

            // uncomment for local json data
            // totalData: this.props.data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0)),
            // currentData: this.props.data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0)),

            summarizedDataByLatLong: null,
            summarizedDataByYear: null
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
        this.updateStateSelection = this.updateStateSelection.bind(this);
        this.updateNationalForestSelection = this.updateNationalForestSelection.bind(this);
        this.updateForestSelection = this.updateForestSelection.bind(this);
        this.updateCurrentData = this.updateCurrentData.bind(this);
        this.clearCurrentData = this.clearCurrentData.bind(this);
        this.getHistoricalData = this.getHistoricalData.bind(this);
        this.updateAvailableNationalForestsAndForests = this.updateAvailableNationalForestsAndForests.bind(this);

        // set cookies
        this.setCookie("stateName", this.state.stateName, 365);
        this.setCookie("stateAbbreviation", this.state.stateAbbreviation, 365);
        this.setCookie("nationalForest", this.state.nationalForest, 365);
        this.setCookie("forest", this.state.forest, 365);
        this.setCookie("startDate", this.state.startDate, 365);
        this.setCookie("endDate", this.state.endDate, 365);
    }
    render() {
        return null;
    }

    componentWillMount() {
        // send query to database
        this.updateCurrentData();

        // get initial dates
        this.getOriginalStartDate();
        this.getOriginalEndDate();
    }

    // query data from database using given filters
    getHistoricalData(filters) {
        var url = this.props.url + "getHistoricalsFilter";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // sort data based on year
                 var sortedData = xmlHttp.response.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0));

                 this.setState({
                     currentData: sortedData
                 }, () => {
                     this.updateAvailableNationalForestsAndForests();
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 console.log("API FAILURE")
                 this.setState({
                     currentData: []
                 });
             }
         }.bind(this);

         xmlHttp.open("POST", url, true);
         xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
         xmlHttp.responseType = 'json';
         xmlHttp.send(jQuery.param(filters));
    }

    // construct filters to be passed to API
    setQueryFilters() {
        // always filter on year
        var filters = {
            startDate: this.state.startDate,
            endDate: this.state.endDate
        }

        // filter on state if the user has selected one
        if (this.state.stateName !== null && this.state.stateName !== "" && this.state.stateAbbreviation !== null && this.state.stateAbbreviation !== "") {
            filters.state = this.state.stateAbbreviation;
        }

        // fitler on national forest if the user has selected one
        if (this.state.nationalForest !== null && this.state.nationalForest !== "") {
            filters.nf = this.state.nationalForest;
        }

        // filter on forest if the user has selected one
        if (this.state.forest !== null && this.state.forest !== "") {
            filters.forest = this.state.forest;
        }

        return filters
    }

    getOriginalStartDate() {
        var url = this.props.url + "getMinimumYear";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // set the state
                 this.setState({
                     originalStartDate: parseInt(xmlHttp.response)
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 this.setState({
                     originalStartDate: this.state.startDate
                 });
             }
         }.bind(this);

         xmlHttp.open("GET", url, true);
         xmlHttp.responseType = 'json';
         xmlHttp.send();
    }

    getOriginalEndDate() {
        var url = this.props.url + "getMaximumYear";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // set the state
                 this.setState({
                     originalEndDate: parseInt(xmlHttp.response)
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 this.setState({
                     originalEndDate: this.state.endDate
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
        if (this.state.startDate === Infinity || this.state.endDate === 0) {
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
        var url = this.props.url + "getUniqueStates";
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

                // update state
                this.setState({
                    availableStates: stateNames
                }, () => {
                    // set state of parent
                    this.props.parent.setState({
                        dataControllerState: this.state
                    });
                });
             }
             // if the request failed, clear the data and notify the user
             else {
                 this.setState({
                     availableStates: []
                 })
             }
         }.bind(this);

         xmlHttp.open("GET", url, true);
         xmlHttp.responseType = 'json';
         xmlHttp.send();
    }

    // add input option fields for national forest selection
    initializeAvailableNationalForests() {
        var filters = this.setQueryFilters();
        var url = this.props.url + "getUniqueNationalForests";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // update state
                 this.setState({
                     availableNationalForests: xmlHttp.response
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 // update state
                 this.setState({
                     availableNationalForests: []
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
        var filters = this.setQueryFilters();
        var url = this.props.url + "getUniqueLocalForests";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // update state
                 this.setState({
                     availableLocalForests: xmlHttp.response
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 // update state
                 this.setState({
                     availableLocalForests: []
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
        var url = this.props.url + "getUniqueYears";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // update state
                 this.setState({
                     availableYears: xmlHttp.response
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 // update state
                 this.setState({
                     availableYears: []
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
        this.setState({
            startDate: this.state.originalStartDate,
            endDate: this.state.originalEndDate
        }, () => {
            // set cookies
            this.setCookie("startDate", this.state.startDate, 365);
            this.setCookie("endDate", this.state.endDate, 365);

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
        if (date >= this.originalStartDate && date <= this.state.endDate) {
            this.setState({
                startDate: date
            }, () => {
                // set cookies
                this.setCookie("startDate", this.state.startDate, 365);

                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        else {
            this.setState({
                startDate: this.state.startDate
            }, () => {
                // set cookies
                this.setCookie("startDate", this.state.startDate, 365);

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
        if (date <= this.originalEndDate && date >= this.state.startDate) {
            this.setState({
                endDate: date
            }, () => {
                // set cookies
                this.setCookie("endDate", this.state.endDate, 365);

                // update current data
                this.updateCurrentData();

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        else {
            this.setState({
                endDate: this.state.endDate
            }, () => {
                // set cookies
                this.setCookie("endDate", this.state.endDate, 365);

                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
    }

    updateYearSelection(year) {
        this.setState({
            startDate: year,
            endDate: year
        }, () => {
            // set cookies
            this.setCookie("startDate", this.state.startDate, 365);
            this.setCookie("endDate", this.state.endDate, 365);

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
        // if the user wants to clear the state selection, set to null
        if (state === null) {
            this.setState({
                stateName: null,
                stateAbbreviation: null,
                nationalForest: null,
                forest: null
            }, () => {
                // set cookies
                this.setCookie("stateName", this.state.stateName, 365);
                this.setCookie("stateAbbreviation", this.state.stateAbbreviation, 365);
                this.setCookie("nationalForest", this.state.nationalForest, 365);
                this.setCookie("forest", this.state.forest, 365);

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
                    this.setState({
                        stateName: state,
                        stateAbbreviation: abbrev,
                        nationalForest: null,
                        forest: null
                    }, () => {
                        // set cookies
                        this.setCookie("stateName", this.state.stateName, 365);
                        this.setCookie("stateAbbreviation", this.state.stateAbbreviation, 365);
                        this.setCookie("nationalForest", this.state.nationalForest, 365);
                        this.setCookie("forest", this.state.forest, 365);

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
                    this.setState({
                        stateName: this.stateAbbrevToStateName[abbrev],
                        stateAbbreviation: abbrev,
                        nationalForest: null,
                        forest: null
                    }, () => {
                        // set cookies
                        this.setCookie("stateName", this.state.stateName, 365);
                        this.setCookie("stateAbbreviation", this.state.stateAbbreviation, 365);
                        this.setCookie("nationalForest", this.state.nationalForest, 365);
                        this.setCookie("forest", this.state.forest, 365);

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
        if (this.state.nationalForest === null) {
            this.setState({
                nationalForest: nationalForest
            }, () => {
                // set cookies
                this.setCookie("nationalForest", this.state.nationalForest, 365);

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
            this.setState({
                nationalForest: nationalForest,
                forest: null
            }, () => {
                // set cookies
                this.setCookie("nationalForest", this.state.nationalForest, 365);
                this.setCookie("forest", this.state.forest, 365);

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
        if (this.state.forest === null) {
            this.setState({
                forest: forest
            }, () => {
                // set cookies
                this.setCookie("forest", this.state.forest, 365);

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
            this.setState({
                forest: forest,
                nationalForest: null
            }, () => {
                // set cookies
                this.setCookie("nationalForest", this.state.nationalForest, 365);
                this.setCookie("forest", this.state.forest, 365);

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
        var filters = this.setQueryFilters();
        var url = this.props.url + "getSummarizedDataByLatLongFilter";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                 // store result
                 this.setState({
                     summarizedDataByLatLong: xmlHttp.response
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
                 console.log("API FAILURE")
                 this.setState({
                     summarizedDataByLatLong: []
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
        var filters = this.setQueryFilters();
        var url = this.props.url + "getSummarizedDataByYearFilter";
        var xmlHttp = new XMLHttpRequest();

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                 // get response
                 var startDate = xmlHttp.response[0] !== null ? xmlHttp.response[0] : this.state.startDate
                 var endDate = xmlHttp.response[1] !== null ? xmlHttp.response[1] : this.state.endDate
                 var data = xmlHttp.response[2]

                 // store result
                 this.setState({
                     startDate: startDate,
                     endDate: endDate,
                     summarizedDataByYear: data
                 }, () => {
                     // set state of parent
                     this.props.parent.setState({
                         dataControllerState: this.state
                     });
                 });
             }
             // if the request failed, clear the data and notify the user
             else {
                 console.log("API FAILURE")
                 this.setState({
                     summarizedDataByYear: []
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
    }

    updateCurrentDataOld() {
        // get data from API
        var filters = this.setQueryFilters();
        var data = this.getHistoricalData(filters);
    }

    // after the state has been updated, also update available forests and national forests
    updateAvailableNationalForestsAndForests() {
        var availableNationalForests = [];
        var availableLocalForests = [];

        if (this.state.stateName !== null && this.state.stateAbbreviation !== null) {
            for (var obj in this.state.summarizedDataByLatLong) {
                // grab national forest and local forests
                var thisNF = this.state.summarizedDataByLatLong[obj].nf;
                var thisForest = this.state.summarizedDataByLatLong[obj].forest;

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
        if (this.state.nationalForest === null && this.state.forest === null) {
            this.setState({
                availableNationalForests: availableNationalForests,
                availableLocalForests: availableLocalForests
            }, () => {
                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        // if only local forest is unselected, update it
        else if (this.state.nationalForest !== null && this.state.forest === null) {
            this.setState({
                availableLocalForests: availableLocalForests
            }, () => {
                // set state of parent
                this.props.parent.setState({
                    dataControllerState: this.state
                });
            });
        }
        // if only national forest is unselected, update it
        else if (this.state.nationalForest === null && this.state.forest !== null) {
            this.setState({
                availableNationalForests: availableNationalForests
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
        this.setState({
            currentData: [],
            stateName: null,
            stateAbbreviation: null,
            nationalForest: null,
            forest: null,
            availableNationalForests: [],
            availableLocalForests: [],
            startDate: this.originalStartDate,
            endDate: this.originalEndDate
        }, () => {
            // set cookies
            this.setCookie("stateName", this.state.stateName, 365);
            this.setCookie("stateAbbreviation", this.state.stateAbbreviation, 365);
            this.setCookie("nationalForest", this.state.nationalForest, 365);
            this.setCookie("forest", this.state.forest, 365);
            this.setCookie("startDate", this.state.startDate, 365);
            this.setCookie("endDate", this.state.endDate, 365);

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
