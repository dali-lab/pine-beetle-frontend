import React, { Component } from 'react';
import ChoiceInput from './input-components/ChoiceInput';
import OptgroupChoiceInput from './input-components/OptgroupChoiceInput';
import '../../styles/fonts/font_stylesheet.css'
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
            availableModelYears: [],
            availableForestsByNF: {}
        }

        // bind functions
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.updateForestSelection = this.updateForestSelection.bind(this);
        this.updateNationalForestSelection = this.updateNationalForestSelection.bind(this);

        // create refs
        this.yearInput = React.createRef();
        this.stateInput = React.createRef();
        this.nationalForestInput = React.createRef();
        this.forestInput = React.createRef();
    }
    render() {
        return(
            <div className="container" id="filter-selections">
                <div id="selection-areas-view-data" style={{textAlign: "left"}}>
                    <div className="stateDivider">
                        <img src={ require('../../assets/america.png') } alt="usa" />
                        <h4 style={{fontSize: '1.25em', fontFamily: 'Graphik Web', fontWeight: 'normal'}}>State & Year</h4>
                    </div>
                    <ChoiceInput instructions="Select Year" submitFunction={this.props.dataController.updatePredictionYearSelection} availableOptions={this.state.availableModelYears} idName="year" value={this.state.predictiveModelDate} ref={this.yearInput} firstOptionText={"Year"}/><br />
                    <ChoiceInput instructions="Select State" submitFunction={this.props.dataController.updateStateSelection} availableOptions={this.state.availableStates} idName="state" value={this.state.stateName} ref={this.stateInput} firstOptionText={"State"}/><br />
                    <OptgroupChoiceInput instructions="Select County / RD" submitFunction={this.props.dataController.updateForestSelection} availableOptions={this.state.availableForestsByNF} idName="forest" value={this.state.forest} ref={this.forestInput} showAboveText={true} firstOptionText={"County / RD"} /><br />
                    <br />
                    <div style={{textAlign: 'right', width: 460}}>
                        <button id="reset-current-data-button" className="submit static-button" onClick={this.props.dataController.clearCurrentData}>Clear Filters</button>
                    </div>
                    <div className="forestDivider">
                        <img src={ require('../../assets/tree.png') } alt="tree" />
                        <h4 style={{fontSize: '1.25em', fontFamily: 'Graphik Web', fontWeight: 'normal'}}>Forests</h4>
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
            availableModelYears: props.dataControllerState.dropDownContent.availableModelYears,
            availableForestsByNF: props.dataControllerState.dropDownContent.availableForestsByNF
        });
    }

    updateForestSelection(value) {
        this.props.dataController.updateForestSelection(value);

        // scroll the user down to the chart area
        // if (value !== null) {
        //     if ($("#pred-model-filters").offset() !== undefined) {
        //         $('html, body').animate({
        //             scrollTop: $("#pred-model-filters").offset().top
        //         }, 800);
        //     }
        //     else {
        //         setTimeout(function() {
        //             if ($("#pred-model-filters").offset() !== undefined) {
        //                 $('html, body').animate({
        //                     scrollTop: $("#pred-model-filters").offset().top
        //                 }, 800);
        //             }
        //         }, 600);
        //     }
        // }
    }

    updateNationalForestSelection(value) {
        this.props.dataController.updateNationalForestSelection(value);
        
        // scroll the user down to the chart area
        // if (value !== null) {
        //     if ($("#pred-model-filters").offset() !== undefined) {
        //         $('html, body').animate({
        //             scrollTop: $("#pred-model-filters").offset().top
        //         }, 800);
        //     }
        //     else {
        //         setTimeout(function() {
        //             if ($("#pred-model-filters").offset() !== undefined) {
        //                 $('html, body').animate({
        //                     scrollTop: $("#pred-model-filters").offset().top
        //                 }, 800);
        //             }
        //         }, 600);
        //     }
        // }
    }
}

export default PredictionsSelectionBar
