import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer.js';
import PredictiveModelIntroText from './PredictiveModelIntroText.js';
import StateLevelBreakDown from './StateLevelBreakDown.js';
import ForestLevelBreakDown from './ForestLevelBreakDown.js';
import StateMap from './mapbox/StateMap.js';
import '../../styles/predictive-model-page/ViewPredictions.css';

class ViewPredictions extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null   // defines the user's current selection for state, national forest, etc.
        }
    }

    render() {
        if (this.state.dataController != null && this.state.dataControllerState != null && this.state.dataControllerState.dropDownContent.availableYears.length > 0) {
            if (this.props.dataControllerState.userFilters.stateAbbreviation !== null) {
                return(
                    <div>
                        <PredictiveModelIntroText />
                        <StateLevelBreakDown dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                        <ForestLevelBreakDown dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                    </div>
                );
            }
            else {
                return(
                    <div>
                        <PredictiveModelIntroText />
                        <div className="container" id="pred-select-state-text">
                            <h3>Please select a state to run the predictive model.</h3>
                            <p>It will take a few seconds to run. Please be patient.</p>
                        </div>
                        <StateMap dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                    </div>
                );
            }
        }
        else {
            return <LoadingContainer />
        }
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if receiving new data, update the state
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    updateStateFromProps(props) {
        if (props.dataController !== undefined && props.dataController != null) {
            this.setState({
                dataController: props.dataController.current
            });
        }

        if (props.dataControllerState !== undefined && props.dataControllerState != null) {
            this.setState({
                dataControllerState: props.dataControllerState
            });
        }
    }
}

export default ViewPredictions
