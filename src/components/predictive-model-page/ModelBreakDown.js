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
                    if (this.state.outputArray[i].inputs.forest !== null && this.state.outputArray[i].inputs.forest !== undefined && this.state.outputArray[i].inputs.forest !== "") {
                        outputs.push(
                            <tr key={i}>
                                <td onClick={this.state.dataController.handleModelForestClick} style={{cursor: "pointer"}}>{this.state.outputArray[i].inputs.forest}</td>
                                <td>{(this.state.outputArray[i].outputs.prob0spots*100).toFixed(2) + "%"}</td>
                                <td>{(this.state.outputArray[i].outputs.prob53spots*100).toFixed(2) + "%"}</td>
                                <td>{this.state.outputArray[i].outputs.expSpotsIfOutbreak.toFixed(2)}</td>
                            </tr>
                        );
    
                    }
                }

                return(
                    <div className="container flex-item-right" id="model-breakdown-container">
                        <table id="model-breakdown-table">
                            <thead>
                                <tr>
                                    <th>Forest Name</th>
                                    <th>% Probability of  >0 Spots</th>
                                    <th>% Probability of  >53 Spots</th>
                                    <th>Expected Spots If Any</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outputs}
                            </tbody>
                        </table>
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
