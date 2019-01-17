import React, { Component } from 'react';

class DataController extends Component {
    constructor(props) {
        super(props);

        // determine initial state variables based on cookies
        var stateName = (this.getCookie("stateName") !== null && this.getCookie("stateName") !== "null") ? this.getCookie("stateName") : null;
        var stateAbbreviation = (this.getCookie("stateAbbreviation") !== null && this.getCookie("stateAbbreviation") !== "null") ? this.getCookie("stateAbbreviation") : null;
        var startDate = (this.getCookie("startDate") !== null && this.getCookie("startDate") !== "null") ? this.getCookie("startDate") : Infinity;
        var endDate = (this.getCookie("endDate") !== null && this.getCookie("endDate") !== "null") ? this.getCookie("endDate") : 0;

        // set national forest and forest cookies
        this.nationalForestCookie = (this.getCookie("nationalForest") !== null && this.getCookie("nationalForest") !== "null") ? this.getCookie("nationalForest") : null;
        this.forestCookie = (this.getCookie("forest") !== null && this.getCookie("forest") !== "null") ? this.getCookie("forest") : null;

        // set state based off cookies
        this.state = {
            stateName: stateName,
            stateAbbreviation: stateAbbreviation,
            nationalForest: null,
            forest: null,
            startDate: startDate,
            endDate: endDate,
            totalData: this.props.data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0)),
            currentData: this.props.data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0)),
            availableStates: [],
            availableLocalForests: [],
            availableNationalForests: []
        }

        // initialize original start and end dates
        this.originalStartDate = this.state.startDate;
        this.originalEndDate = this.state.endDate;

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
        this.updateStateSelection = this.updateStateSelection.bind(this);
        this.updateNationalForestSelection = this.updateNationalForestSelection.bind(this);
        this.updateForestSelection = this.updateForestSelection.bind(this);
        this.updateCurrentData = this.updateCurrentData.bind(this);
        this.clearCurrentData = this.clearCurrentData.bind(this);

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

    // update start and end dates initially available to user, hold onto original dates, initialize the state drop-down menu
    componentDidMount() {
        // if didn't have cookie for start or end date, set the start and end date
        if (this.state.startDate === Infinity || this.state.endDate === 0) {
            this.updateStartAndEndDateFromCurrentData();
        }

        // calculate start dates for bounds on date inputs
        this.calculateOriginalStartAndEndDates();

        // initialize drop-down-menu options
        this.initializeAvailableStates();
        this.initializeAvailableNationalForests();
        this.initializeAvailableLocalForests();

        console.log(this.nationalForestCookie)

        // choose national forest
        if (this.nationalForestCookie !== null) {
            this.updateNationalForestSelection(this.nationalForestCookie);
        }

        // choose forest
        if (this.forestCookie !== null) {
            this.updateForestSelection(this.forestCookie);
        }
    }

    // add input option fields for state selection
    initializeAvailableStates() {
        var stateNamesToAdd = [];

        // iterate over totalData
        for (var obj in this.state.totalData) {
            // grab state abbreviation and name
            var stateAbbrev = this.state.totalData[obj].state;
            var stateName = this.stateAbbrevToStateName[stateAbbrev];

            // check if we haven't already added this state
            if (!stateNamesToAdd.includes(stateName) && !this.state.availableStates.includes(stateName)) {
                stateNamesToAdd.push(stateName);
            }
        }

        // update state
        this.setState({
            availableStates: stateNamesToAdd
        }, () => {
            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            });
        });
    }

    // add input option fields for national forest selection
    initializeAvailableNationalForests() {
        var nationalForestNamesToAdd = [];

        // iterate over totalData
        for (var obj in this.state.totalData) {
            // grab national forest name
            var nf = this.state.totalData[obj].nf;

            // check if we haven't already added this state
            if (!nationalForestNamesToAdd.includes(nf) && !this.state.availableNationalForests.includes(nf) && this.state.totalData[obj].state === this.state.stateAbbreviation && nf !== "") {
                nationalForestNamesToAdd.push(nf);
            }
        }

        // update state
        this.setState({
            availableNationalForests: nationalForestNamesToAdd
        }, () => {
            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            });
        });
    }

    // add input option fields for local forest selection
    initializeAvailableLocalForests() {
        var forestNamesToAdd = [];

        // iterate over totalData
        for (var obj in this.state.totalData) {
            // grab national forest name
            var forest = this.state.totalData[obj].forest;

            // check if we haven't already added this state
            if (!forestNamesToAdd.includes(forest) && !this.state.availableLocalForests.includes(forest) && this.state.totalData[obj].state === this.state.stateAbbreviation && forest !== "") {
                forestNamesToAdd.push(forest);
            }
        }

        // update state
        this.setState({
            availableLocalForests: forestNamesToAdd
        }, () => {
            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            });
        });
    }

    // update the start and end dates for the available data
    updateStartAndEndDateFromCurrentData() {
        var startDate = Infinity;
        var endDate = 0;
        for (var obj in this.state.currentData) {
            // set startDate
            if (this.state.currentData[obj].year < startDate) {
                startDate = this.state.currentData[obj].year;
            }
            // set endDate
            if (this.state.currentData[obj].year > endDate) {
                endDate = this.state.currentData[obj].year;
            }
        }
        // set the state then hold onto the original values
        this.setState({
            startDate: startDate,
            endDate: endDate
        }, () => {
            // set cookies
            this.setCookie("startDate", startDate, 365);
            this.setCookie("endDate", endDate, 365);

            // update current data
            this.updateCurrentData();

            // set state of parent
            this.props.parent.setState({
                dataControllerState: this.state
            });
        });
    }

    // determine very first and very last year in dataset
    calculateOriginalStartAndEndDates() {
        var startDate = Infinity;
        var endDate = 0;
        for (var obj in this.state.totalData) {
            // set startDate
            if (this.state.totalData[obj].year < startDate) {
                startDate = this.state.totalData[obj].year;
            }
            // set endDate
            if (this.state.totalData[obj].year > endDate) {
                endDate = this.state.totalData[obj].year;
            }
        }

        // hold original start and end dates
        this.originalStartDate = startDate;
        this.originalEndDate = endDate;
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

    // update current data based on the user selections for state, forest, date, etc.
    updateCurrentData() {
        var newSet = [];

        // if the user hasn't selected a state, take all of the data in date range
        if (this.state.stateName === null && this.state.stateAbbreviation === null) {
            for (var i in this.state.totalData) {
                // ensure in proper date range
                if ((this.state.totalData[i].year >= this.state.startDate && this.state.totalData[i].year <= this.state.endDate)) {
                    newSet.push(this.state.totalData[i]);
                }
            }
        }
        else {
            for (i in this.state.totalData) {
                // ensure in proper date range and state
                if ((this.state.totalData[i].year >= this.state.startDate && this.state.totalData[i].year <= this.state.endDate && this.state.totalData[i].state === this.state.stateAbbreviation)) {

                    // handle case where user selects only a state
                    if (this.state.nationalForest == null && this.state.forest == null) {
                        newSet.push(this.state.totalData[i]);
                    }

                    // handle case where user selects state and national forest but not local
                    else if (this.state.nationalForest != null && this.state.forest == null) {
                        if (this.state.totalData[i].nf === this.state.nationalForest) {
                            newSet.push(this.state.totalData[i]);
                        }
                    }

                    // handle case where user selects state  and local forest but not national
                    else if (this.state.nationalForest == null && this.state.forest != null) {
                        if (this.state.totalData[i].forest === this.state.forest) {
                            newSet.push(this.state.totalData[i]);
                        }
                    }

                    // handle case where user selects state, national forest, and local forest
                    else if (this.state.nationalForest != null && this.state.forest != null) {
                        if (this.state.totalData[i].nf === this.state.nationalForest && this.state.totalData[i].forest === this.state.forest) {
                            newSet.push(this.state.totalData[i]);
                        }
                    }
                }
            }
        }

        // also update available forests and national forests
        var availableNationalForests = [];
        var availableLocalForests = [];

        if (this.state.stateName !== null && this.state.stateAbbreviation !== null) {
            for (var obj in newSet) {
                // grab national forest and local forests
                var thisNF = newSet[obj].nf;
                var thisForest = newSet[obj].forest;

                // add to arrays
                if (!availableNationalForests.includes(thisNF) && thisNF !== "") {
                    availableNationalForests.push(thisNF);
                }
                if (!availableLocalForests.includes(thisForest) && thisForest !== "") {
                    availableLocalForests.push(thisForest);
                }
            }
        }

        // sort data based on year
        newSet = newSet.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0));

        // update the state
        this.setState({
            currentData: newSet
        }, () => {
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
                    // set cookies
                    this.setCookie("availableNationalForests", this.state.availableNationalForests, 365);

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
        });
    }

    // set current to total and update menus/dropdowns
    clearCurrentData() {
        this.setState({
            currentData: this.state.totalData,
            stateName: null,
            stateAbbreviation: null,
            nationalForest: null,
            forest: null,
            availableNationalForests: [],
            availableLocalForests: []
        }, () => {
            // set cookies
            this.setCookie("stateName", this.state.stateName, 365);
            this.setCookie("stateAbbreviation", this.state.stateAbbreviation, 365);
            this.setCookie("nationalForest", this.state.nationalForest, 365);
            this.setCookie("forest", this.state.forest, 365);

            // update data
            this.updateStartAndEndDateFromCurrentData();
            this.updateCurrentData();

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
