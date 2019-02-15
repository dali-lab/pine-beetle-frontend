import React, { Component } from 'react';
import '../../styles/predictive-model-page/ViewModelOutput.css';

class ViewModelOutput extends Component {
    render() {
        return(
            <div>
                <div className="flex-container">
                    <div className="container" id="filter-selections">
                        <div id="selection-areas-view-data">
                            <h3 style={{textDecoration: "underline"}}>Model Outputs</h3>
                            <h3>Expected Spots If Outbreak: <span className="no-bold">{this.props.modelOutputs.expSpotsIfOutbreak.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 0 Spots: <span className="no-bold">{this.props.modelOutputs.prob0spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 19 Spots: <span className="no-bold">{this.props.modelOutputs.prob19spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 53 Spots: <span className="no-bold">{this.props.modelOutputs.prob53spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 147 Spots: <span className="no-bold">{this.props.modelOutputs.prob147spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 402 Spots: <span className="no-bold">{this.props.modelOutputs.prob402spots.toFixed(3)}</span></h3>
                            <h3>Probability &gt; 1095 Spots: <span className="no-bold">{this.props.modelOutputs.prob1095spots.toFixed(3)}</span></h3>
                        </div>
                    </div>
                </div>
                <div className="flex-container">
                    <div className="container" id="filter-selections">
                        <div id="selection-areas-view-data">
                            <h3 style={{textDecoration: "underline"}}>Model Inputs</h3>
                            <h3>SPB: <span className="no-bold">{this.props.modelInputs.SPB}</span></h3>
                            <h3>cleridst1: <span className="no-bold">{this.props.modelInputs.cleridst1}</span></h3>
                            <h3>spotst1: <span className="no-bold">{this.props.modelInputs.spotst1}</span></h3>
                            <h3>spotst2: <span className="no-bold">{this.props.modelInputs.spotst2}</span></h3>
                            <h3>endobrev: <span className="no-bold">1</span></h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewModelOutput
