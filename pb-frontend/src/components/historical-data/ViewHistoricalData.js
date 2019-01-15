import React, { Component } from 'react';
import SelectionBar from '../selection-bar/SelectionBar';
import ChartArea from './ChartArea';
import { Map } from 'react-arcgis';
import MapController from './MapController';
import MapSideBar from './MapSideBar';
import '../../styles/historical-data/ViewHistoricalData.css';

class ViewHistoricalData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stateName: null,
            stateAbbreviation: null,
            nationalForest: null,
            forest: null,
            startDate: Infinity,
            endDate: 0,
            totalData: this.props.data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0)),
            currentData: this.props.data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0)),
            availableStates: [],
            availableLocalForests: [],
            availableNationalForests: [],
            viewProperties: {
                center: [-84.3880, 33.7490],
                zoom: 5.5
            }
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
        this.movePredictionModelDown = this.movePredictionModelDown.bind(this);

        // create refs
        this.topDivRef = React.createRef();
        this.selectionBar = React.createRef();

    }
    render() {
        return(
            <div ref={this.topDivRef}>
    			<div className="flex-container">
    				<div className="container" id="filter-selections">
    					<div id="selection-areas-view-data">
                            <SelectionBar ref={this.selectionBar}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                stateName={this.state.stateName}
                                nationalForest={this.state.nationalForest}
                                forest={this.state.forest}
                                availableStates={this.state.availableStates}
                                availableNationalForests={this.state.availableNationalForests}
                                availableLocalForests={this.state.availableLocalForests}

                                updateStartDate={this.updateStartDate}
                                updateEndDate={this.updateEndDate}
                                updateStateSelection={this.updateStateSelection}
                                updateNationalForestSelection={this.updateNationalForestSelection}
                                updateForestSelection={this.updateForestSelection}
                                clearCurrentData={this.clearCurrentData}
                                movePredictionModelDown={this.movePredictionModelDown}
                            />
    					</div>
    				</div>
    			</div>

                <div className="flex-container" id="data-insights-holder">
    				<div className="container data-insights flex-item" id="data-insights">
    					<ChartArea data={this.state.currentData} />
    				</div>
    			</div>

                <div className="flex-container" id="map-area-container">
    				<div className="container map flex-item flex-item-left" id="map-area">
    					<div id="viewDiv">
                            <Map viewProperties={this.state.viewProperties} >
                                <MapController data={this.state.currentData} updateState={this.updateStateSelection} updateNF={this.updateNationalForestSelection} updateForest={this.updateForestSelection}/>
                            </Map>
                        </div>
    				</div>
                    <div className="container flex-item flex-item-right" id="beetle-count-area">
                        <MapSideBar data={this.state.currentData} stateName={this.state.stateName} nationalForest={this.state.nationalForest} forest={this.state.forest} clearFunction={this.clearCurrentData}/>
                    </div>
    			</div>
    		</div>
        );
    }

    // update start and end dates initially available to user, hold onto original dates, initialize the state drop-down menu
    componentDidMount() {
        this.updateStartAndEndDateFromCurrentData();
        this.initializeAvailableStates();
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
            this.originalStartDate = this.state.startDate;
            this.originalEndDate = this.state.endDate;
            this.updateCurrentData();
        });
    }

    // update start date and ensure requested date is available
    updateStartDate(date) {
        // figure out the minimum date in currentData
        var minDate = Infinity;

        for (var i in this.state.currentData) {
            if (this.state.currentData[i].year < minDate) {
                minDate = this.state.currentData[i].year;
            }
        }

        // so long as the newly requested date isn't before minDate, update state
        if (date >= minDate) {
            this.setState({
                startDate: date
            }, () => {
                this.updateCurrentData();
            });
        }
        else {
            this.setState({
                startDate: this.state.startDate
            });
        }
    }

    // update end date and ensure requested date is available
    updateEndDate(date) {
        // figure out the minimum date in currentData
        var maxDate = 0;

        for (var i in this.state.currentData) {
            if (this.state.currentData[i].year > maxDate) {
                maxDate = this.state.currentData[i].year;
            }
        }

        // so long as the newly requested date isn't before minDate, update state
        if (date <= maxDate) {
            this.setState({
                endDate: date
            }, () => {
                this.updateCurrentData();
            });
        }
        else {
            this.setState({
                endDate: this.state.endDate
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
                this.updateCurrentData();
                this.selectionBar.current.stateInput.current.selectGivenInput(this.state.stateName)
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
                        this.updateCurrentData();
                        this.selectionBar.current.stateInput.current.selectGivenInput(this.state.stateName)
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
                        this.updateCurrentData();
                        this.selectionBar.current.stateInput.current.selectGivenInput(this.state.stateName)
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
                this.updateCurrentData();
                this.selectionBar.current.nationalForestInput.current.selectGivenInput(this.state.nationalForest)
            });
        }
        // if we are going from a non-null selection to a new selection, clear local forest
        else {
            this.setState({
                nationalForest: nationalForest,
                forest: null
            }, () => {
                this.updateCurrentData();
                this.selectionBar.current.nationalForestInput.current.selectGivenInput(this.state.nationalForest)
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
                this.updateCurrentData();
                this.selectionBar.current.forestInput.current.selectGivenInput(this.state.forest)
            });
        }
        // if we are going from a non-null selection to a new selection, clear national forest
        else {
            this.setState({
                forest: forest,
                nationalForest: null
            }, () => {
                this.updateCurrentData();
                this.selectionBar.current.forestInput.current.selectGivenInput(this.state.forest)
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
                });
            }
            // if only local forest is unselected, update it
            else if (this.state.nationalForest !== null && this.state.forest === null) {
                this.setState({
                    availableLocalForests: availableLocalForests
                });
            }
            // if only national forest is unselected, update it
            else if (this.state.nationalForest === null && this.state.forest !== null) {
                this.setState({
                    availableNationalForests: availableNationalForests
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
            this.updateStartAndEndDateFromCurrentData();
            this.updateCurrentData();

            // clear instruction text
            this.selectionBar.current.stateInput.current.resetOptionText();
            this.selectionBar.current.nationalForestInput.current.resetOptionText();
            this.selectionBar.current.forestInput.current.resetOptionText();

            // deselect state (does not re-render because list of states does not change)
            this.selectionBar.current.stateInput.current.selectField.current.selectedIndex = 0;
        });
    }

    // move the prediction model down
    movePredictionModelDown() {
        // grab references
        var area1 = this.topDivRef.current.children[1];
        var area2 = this.topDivRef.current.children[2];

        // remove
        this.topDivRef.current.removeChild(area1);
        this.topDivRef.current.removeChild(area2);

        // add
        this.topDivRef.current.appendChild(area2);
        this.topDivRef.current.appendChild(area1);
    }
}

export default ViewHistoricalData
