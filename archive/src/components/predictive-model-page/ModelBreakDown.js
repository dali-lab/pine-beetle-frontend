import React, { Component } from 'react';
import '../../styles/predictive-model-page/ModelBreakDown.css';
import PredictionsSelectionBar from '../selection-bars/PredictionsSelectionBar.js';
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
                    if (this.state.outputArray[i].inputs.forest !== null && this.state.outputArray[i].inputs.forest !== undefined && this.state.outputArray[i].inputs.forest !== "") {
                        if (this.state.outputArray[i].inputs.forest === this.state.dataControllerState.userFilters.forest) {
                            outputs.push(
                                <div className="forestRow" id="forestRowSelected">
                                    <span id="forestName" onClick={this.state.dataController.handleModelForestClick} style={{cursor: "pointer"}}>{this.state.outputArray[i].inputs.forest}</span>
                                    <div className="forestRowData">
                                        <span>{(this.state.outputArray[i].outputs.prob0spots*100).toFixed(2) + "%"}</span> | <span>{(this.state.outputArray[i].outputs.prob53spots*100).toFixed(2) + "%"}</span>
                                    </div>
                                </div>
                            );
                        }
                        else {
                            outputs.push(
                                <div className="forestRow">
                                    <span id="forestName" onClick={this.state.dataController.handleModelForestClick} style={{cursor: "pointer"}}>{this.state.outputArray[i].inputs.forest}</span>
                                    <div className="forestRowData">
                                        <span>{(this.state.outputArray[i].outputs.prob0spots*100).toFixed(2) + "%"}</span> | <span>{(this.state.outputArray[i].outputs.prob53spots*100).toFixed(2) + "%"}</span>
                                    </div>
                                </div>
                            );
                        }
                    }
                }

                return(
                    <div>
                        <PredictionsSelectionBar dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                        <div className="container flex-item-right" id="model-breakdown-container">
                            {outputs}
                        </div>
                        <div style={{textAlign: "center", width: 500, marginTop: 20}}>
                            <p style={{opacity: 0.5}}>Probability of: <span style={{fontWeight: 'bold'}}>any spots</span> | <span style={{fontWeight: 'bold'}}>more than 50 spots</span>.</p>
                        </div>
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
                dataController: props.dataController
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
