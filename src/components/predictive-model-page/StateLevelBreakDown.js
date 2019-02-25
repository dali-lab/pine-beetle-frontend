import React, { Component } from 'react';
import PredictiveMap from './mapbox/PredictiveMap.js';
import ModelBreakDown from './ModelBreakDown.js';

class StateLevelBreakDown extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null   // defines the user's current selection for state, national forest, etc.
        }
    }

    render() {
        if (this.state.dataController !== null && this.state.dataControllerState !== null) {
            return(
                <div className="flex-container">
                    <PredictiveMap dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                    <ModelBreakDown dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                </div>
            );
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
                dataControllerState: props.dataControllerState
            });
        }
    }
}

export default StateLevelBreakDown
