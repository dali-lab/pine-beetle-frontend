import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ReactTooltip from 'react-tooltip'
import TextInput from './input-components/TextInput';
import ChoiceInput from './input-components/ChoiceInput';
import '../../styles/selection-bar/InputFields.css';

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
            availableNationalForests: [],
            availableLocalForests: []
        }

        // bind functions
        this.updateStateFromProps = this.updateStateFromProps.bind(this);

        // create refs
        this.stateInput = React.createRef();
        this.nationalForestInput = React.createRef();
        this.forestInput = React.createRef();
    }
    render() {
        return(
            <div className="flex-container">
                <div className="container" id="filter-selections">
                    <div id="selection-areas-view-data">
                        <TextInput instructions="Enter Start Year" submitFunction={this.props.updateStartDate} valueToDisplay={this.state.startDate}/>
                        <TextInput instructions="Enter End Year" submitFunction={this.props.updateEndDate} valueToDisplay={this.state.endDate}/>

                        <ChoiceInput instructions="Select State" submitFunction={this.props.updateStateSelection} availableOptions={this.state.availableStates} idName="state" value={this.state.stateName} ref={this.stateInput}/>
                        <ChoiceInput instructions="Select Natl Forest" submitFunction={this.props.updateNationalForestSelection} availableOptions={this.state.availableNationalForests} idName="nationalForest" value={this.state.nationalForest} ref={this.nationalForestInput}/>
                        <ChoiceInput instructions="Select Local Forest" submitFunction={this.props.updateForestSelection} availableOptions={this.state.availableLocalForests} idName="forest" value={this.state.forest} ref={this.forestInput}/>

                        <button id="reset-current-data-button" className="submit static-button" onClick={this.props.clearCurrentData}>Clear Filters</button>
                        <button id="adjust-map-size-button" className="submit static-button" onClick={this.props.movePredictionModelDown} data-tip="Move the charts and map around">Toggle View</button>

                        <Link to="/arcgis-online" data-tip="See the ArcGIS Online Map">ArcGIS Online</Link>
                        <ReactTooltip />
                    </div>
                </div>
    		</div>
        );
    }

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
            startDate: props.startDate,
            endDate: props.endDate,
            stateName: props.stateName,
            nationalForest: props.nationalForest,
            forest: props.forest,
            availableStates: props.availableStates,
            availableNationalForests: props.availableNationalForests,
            availableLocalForests: props.availableLocalForests
        });
    }
}

export default HistoricalDataSelectionBar
