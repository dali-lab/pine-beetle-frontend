import React, { Component } from 'react';
import { CSVDownload } from "react-csv";
// import ReactTooltip from 'react-tooltip';
import TextInput from './input-components/TextInput';
import ChoiceInput from './input-components/ChoiceInput';
import OptgroupChoiceInput from'./input-components/OptgroupChoiceInput';
import '../../styles/selection-bars/InputFields.css';
var jQuery = require("jquery");

class HistoricalDataSelectionBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: null,
            endDate: null,
            stateName: null,
            nationalForest: null,
            forest: null,
            availableStates: [],
            availableForestsByNF: {},
            csvDownload: null
        }

        // bind functions
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.getCSVData = this.getCSVData.bind(this);

        // create refs
        this.stateInput = React.createRef();
        this.nationalForestInput = React.createRef();
        this.forestInput = React.createRef();
    }

    render() {
        const sortedAvailableForests = {};
        Object.entries(this.state.availableForestsByNF)
          .filter(([key]) => key !== 'COUNTIES')
          .sort(([key1], [key2]) => key1.localeCompare(key2))
          .forEach(([key, value]) => sortedAvailableForests[key] = value);
        sortedAvailableForests.COUNTIES = this.state.availableForestsByNF.COUNTIES;
        console.log(sortedAvailableForests);
        return(
            <div className="container" style={{display: 'flex'}}>
                <TextInput instructions="Start Year" submitFunction={this.updateStartDate} valueToDisplay={this.state.startDate}/>
                <TextInput instructions="End Year" submitFunction={this.updateEndDate} valueToDisplay={this.state.endDate}/>
                <ChoiceInput instructions="Select State" submitFunction={this.props.dataController.updateStateSelection} availableOptions={this.state.availableStates} idName="state" value={this.state.stateName} ref={this.stateInput} firstOptionText={"State"} />
                <OptgroupChoiceInput instructions="Select County / RD" submitFunction={this.props.dataController.updateForestSelection} availableOptions={sortedAvailableForests} idName="forest" value={this.state.forest} ref={this.forestInput} showAboveText={true} firstOptionText={"County / RD"} />
                <button id="reset-current-data-button" className="submit static-button clear-button" onClick={this.props.dataController.clearCurrentData}>Clear Filters</button>
                <button id="reset-current-data-button" className="submit static-button export-button" onClick={this.getCSVData} data-tip="Make sure to allow browser popups!">Export CSV</button>
            </div>
        );
    }

    // <ChoiceInput instructions="Select Natl Forest" submitFunction={this.props.dataController.updateNationalForestSelection} availableOptions={this.state.availableNationalForests} idName="nationalForest" value={this.state.nationalForest} ref={this.nationalForestInput}/>
    // <ChoiceInput instructions="Select Local Forest" submitFunction={this.props.dataController.updateForestSelection} availableOptions={this.state.availableLocalForests} idName="forest" value={this.state.forest} ref={this.forestInput}/>

    // on mount, update the state
    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if we are receiving new data, update the state before rendering
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // recalculate values to show on page
    updateStateFromProps(props) {
        this.setState({
            startDate: props.dataControllerState.userFilters.startDate,
            endDate: props.dataControllerState.userFilters.endDate,
            stateName: props.dataControllerState.userFilters.stateName,
            nationalForest: props.dataControllerState.userFilters.nationalForest,
            forest: props.dataControllerState.userFilters.forest,
            availableStates: props.dataControllerState.dropDownContent.availableStates,
            availableForestsByNF: props.dataControllerState.dropDownContent.availableForestsByNF
        });
    }

    updateStartDate(value) {
        if (!isNaN(value)) {
            this.props.dataController.updateStartDate(parseInt(value))
        }
        else {
            this.setState({
                startDate: this.state.startDate
            });
        }
    }

    updateEndDate(value) {
        if (!isNaN(value)) {
            this.props.dataController.updateEndDate(parseInt(value))
        }
        else {
            this.setState({
                endDate: this.state.endDate
            });
        }
    }

    getCSVData() {
        // query data from database using given filters
        var url = this.props.dataControllerState.url + "getHistoricalsFilter";
        var xmlHttp = new XMLHttpRequest();
        var filters = this.props.dataController.setQueryFilters(false);

         xmlHttp.onload = function() {
             // if the request was successful hold onto the data
             if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                 // sort data based on year
                 var sortedData = xmlHttp.response.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0));

                 // cause the component to remount -- thereby downloading the csv for the user
                 this.setState({
                     csvDownload: <CSVDownload data={sortedData} />
                 }, () => {
                     // after remount, set the component to null again -- allows user to redownload if desired
                     this.setState({
                         csvDownload: null
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

export default HistoricalDataSelectionBar
