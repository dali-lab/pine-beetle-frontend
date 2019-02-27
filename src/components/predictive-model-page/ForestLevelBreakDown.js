import React, { Component } from 'react';
import OptgroupChoiceInput from '../selection-bars/input-components/OptgroupChoiceInput.js';
import ModelInputArea from './ModelInputArea.js';
import ProbabilityDistribution from './ProbabilityDistribution.js';

class ForestLevelBreakDown extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null,   // defines the user's current selection for state, national forest, etc.
        }

    }

    render() {
        if (this.state.dataController !== null && this.state.dataControllerState !== null) {
            if (this.state.dataControllerState.runningModel) {
                return null;
            }
            else if (this.state.dataControllerState.userFilters.forest !== null) {
                return(
                    <div>
                        <div className="container" id="now-viewing-model-container">
                            <p>Currently viewing data for: <span>{<OptgroupChoiceInput instructions="Select County / RD" submitFunction={this.props.dataController.updateForestSelection} availableOptions={this.props.dataControllerState.dropDownContent.availableForestsByNF} idName="forest" value={this.props.dataControllerState.userFilters.forest} showAboveText={false} />}</span>Select a new locality to view a different forest's data.</p>
                        </div>
                        <ModelInputArea dataControllerState={this.state.dataControllerState} dataController={this.state.dataController} />
                        <ProbabilityDistribution dataControllerState={this.state.dataControllerState} data={this.state.outputs} />
                    </div>
                );
            }
            else {
                return null;
            }
        }
        else {
            return null;
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
                dataController: props.dataController
            });
        }

        if (props.dataControllerState !== undefined && props.dataControllerState != null) {
            this.setState({
                dataControllerState: props.dataControllerState,
                inputs: props.dataControllerState.predictiveModelInputs,
                outputs: props.dataControllerState.predictiveModelOutputs
            });
        }
    }
}

export default ForestLevelBreakDown
