import React, { Component } from 'react';
import TextInput from '../selection-bars/input-components/TextInput';
import '../../styles/predictive-model-page/ViewModelOutput.css';

class ViewModelOutput extends Component {
    render() {
        return(
            <div>
                <div className="flex-container">
                    <div className="container" id="filter-selections">
                        <div id="selection-areas-view-data">
                            <TextInput instructions="SPB" submitFunction={this.props.dataController.updateSPBSelection} valueToDisplay={this.props.dataControllerState.predictiveModelInputs.SPB}/>
                            <TextInput instructions="cleridst1" submitFunction={this.props.dataController.updateCleridst1Selection} valueToDisplay={this.props.dataControllerState.predictiveModelInputs.cleridst1}/>
                            <TextInput instructions="spotst1" submitFunction={this.props.dataController.updateSpotst1Selection} valueToDisplay={this.props.dataControllerState.predictiveModelInputs.spotst1}/>
                            <TextInput instructions="spotst2" submitFunction={this.props.dataController.updateSpotst2Selection} valueToDisplay={this.props.dataControllerState.predictiveModelInputs.spotst2}/>

                            <button id="reset-current-data-button" className="submit static-button" onClick={this.props.dataController.getCustomModelOutputs}>Run Model</button>
                        </div>
                    </div>
                </div>
                <div className="flex-container">
                    <div className="container" id="filter-selections">
                        <div id="selection-areas-view-data">
                            <h3 style={{textDecoration: "underline"}}>Model Outputs</h3>
                            <h3>Expected Spots If Outbreak: <span className="no-bold">{this.props.dataControllerState.predictiveModelOutputs.expSpotsIfOutbreak.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 0 Spots: <span className="no-bold">{this.props.dataControllerState.predictiveModelOutputs.prob0spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 19 Spots: <span className="no-bold">{this.props.dataControllerState.predictiveModelOutputs.prob19spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 53 Spots: <span className="no-bold">{this.props.dataControllerState.predictiveModelOutputs.prob53spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 147 Spots: <span className="no-bold">{this.props.dataControllerState.predictiveModelOutputs.prob147spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 402 Spots: <span className="no-bold">{this.props.dataControllerState.predictiveModelOutputs.prob402spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 1095 Spots: <span className="no-bold">{this.props.dataControllerState.predictiveModelOutputs.prob1095spots.toFixed(3)}</span></h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewModelOutput