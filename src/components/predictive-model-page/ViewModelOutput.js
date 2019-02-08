import React, { Component } from 'react';
import '../../styles/predictive-model-page/ViewModelOutput.css';

class ViewModelOutput extends Component {
    render() {
        return(
            <div className="flex-container">
                <div className="container" id="filter-selections">
                    <div id="selection-areas-view-data">
                        <h3>Expected Spots If Outbreak: <span className="no-bold">{this.props.modelOutputs.expSpotsIfOutbreak}</span></h3>
                        <h3>Probability &gt; 0 Spots: <span className="no-bold">{this.props.modelOutputs.prob0spots}</span></h3>
                        <h3>Probability &gt; 19 Spots: <span className="no-bold">{this.props.modelOutputs.prob19spots}</span></h3>
                        <h3>Probability &gt; 53 Spots: <span className="no-bold">{this.props.modelOutputs.prob53spots}</span></h3>
                        <h3>Probability &gt; 147 Spots: <span className="no-bold">{this.props.modelOutputs.prob147spots}</span></h3>
                        <h3>Probability &gt; 402 Spots: <span className="no-bold">{this.props.modelOutputs.prob402spots}</span></h3>
                        <h3>Probability &gt; 1095 Spots: <span className="no-bold">{this.props.modelOutputs.prob1095spots}</span></h3>
                    </div>
                </div>
    		</div>
        );
    }
}

export default ViewModelOutput
