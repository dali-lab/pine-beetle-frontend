import React, { Component } from 'react';
import { Link } from "react-router-dom";
import TextInput from './input-components/TextInput';
import ChoiceInput from './input-components/ChoiceInput';
import '../../styles/selection-bars/InputFields.css';

class PredictionsSelectionBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            predictiveModelDate: null,
            stateName: null,
            nationalForest: null,
            forest: null,
            availableStates: [],
            availableNationalForests: [],
            availableLocalForests: [],
            availableModelYears: []
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
                        <ChoiceInput instructions="Select Year" submitFunction={this.props.dataController.updatePredictionYearSelection} availableOptions={this.state.availableModelYears} idName="year" value={this.state.predictiveModelDate} ref={this.yearInput}/>
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
            predictiveModelDate: props.dataControllerState.userFilters.predictiveModelDate,
            stateName: props.dataControllerState.userFilters.stateName,
            nationalForest: props.dataControllerState.userFilters.nationalForest,
            forest: props.dataControllerState.userFilters.forest,
            availableStates: props.dataControllerState.dropDownContent.availableStates,
            availableNationalForests: props.dataControllerState.dropDownContent.availableNationalForests,
            availableLocalForests: props.dataControllerState.dropDownContent.availableLocalForests,
            availableModelYears: props.dataControllerState.dropDownContent.availableModelYears
        });
    }
}

export default PredictionsSelectionBar
