import React, { Component } from 'react';
import '../../styles/predictive-model-page/ModelBreakDown.css';
import RunningModel from '../RunningModel';

class ModelBreakDown extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null,   // defines the user's current selection for state, national forest, etc.
            outputArray: []
        }
    }

    render() {
        if (this.state.dataController !== null && this.state.dataControllerState !== null) {
            if (!this.state.dataControllerState.runningModel) {
                var outputs = [];

                for (var i in this.state.outputArray) {
                    outputs.push(JSON.stringify(this.state.outputArray[i]))
                }
                return(
                    <div className="container flex-item flex-item-right" id="model-breakdown-container">
                        {outputs}
                    </div>
                );
            }
            else {
                return(
                    <div className="container flex-item flex-item-right" id="model-breakdown-container">
                        <RunningModel dataControllerState={this.state.dataControllerState} />
                    </div>
                );
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
                dataController: props.dataController.current
            });
        }

        if (props.dataControllerState !== undefined && props.dataControllerState != null) {
            this.setState({
                dataControllerState: props.dataControllerState,
                outputArray: props.dataControllerState.predictiveModelOutputArray
            });
        }
    }
}

export default ModelBreakDown
