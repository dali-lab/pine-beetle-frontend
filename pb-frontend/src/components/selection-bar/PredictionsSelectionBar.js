import React, { Component } from 'react';
import { Link } from "react-router-dom";
import TextInput from './input-components/TextInput';
import ChoiceInput from './input-components/ChoiceInput';
import '../../styles/selection-bar/InputFields.css';

class PredictionsSelectionBar extends Component {
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
        this.yearInput = React.createRef();
        this.stateInput = React.createRef();
        this.nationalForestInput = React.createRef();
        this.forestInput = React.createRef();
    }
    render() {
        return(
            <div className="flex-container">
                <div className="container" id="filter-selections">
                    <div id="selection-areas-view-data">
                        <ChoiceInput instructions="Select Year" submitFunction={this.props.dataController.updateYearSelection} availableOptions={this.state.availableYears} idName="year" value={this.state.startDate} ref={this.yearInput}/>
                        <ChoiceInput instructions="Select State" submitFunction={this.props.dataController.updateStateSelection} availableOptions={this.state.availableStates} idName="state" value={this.state.stateName} ref={this.stateInput}/>
                        <ChoiceInput instructions="Select Natl Forest" submitFunction={this.props.dataController.updateNationalForestSelection} availableOptions={this.state.availableNationalForests} idName="nationalForest" value={this.state.nationalForest} ref={this.nationalForestInput}/>
                        <ChoiceInput instructions="Select Local Forest" submitFunction={this.props.dataController.updateForestSelection} availableOptions={this.state.availableLocalForests} idName="forest" value={this.state.forest} ref={this.forestInput}/>

                        <button id="reset-current-data-button" className="submit static-button" onClick={this.props.dataController.clearCurrentData}>Clear Filters</button>
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
            startDate: props.dataControllerState.startDate,
            endDate: props.dataControllerState.endDate,
            stateName: props.dataControllerState.stateName,
            nationalForest: props.dataControllerState.nationalForest,
            forest: props.dataControllerState.forest,
            availableStates: props.dataControllerState.availableStates,
            availableNationalForests: props.dataControllerState.availableNationalForests,
            availableLocalForests: props.dataControllerState.availableLocalForests,
            availableYears: props.dataControllerState.availableYears
        });
    }
}

export default PredictionsSelectionBar
