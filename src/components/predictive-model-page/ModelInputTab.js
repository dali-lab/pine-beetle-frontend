import React, { Component } from 'react'
import TimelineInput from '../selection-bars/input-components/TimelineInput.js';

class ModelInputTab extends Component {
    render() {
        return (
        <div className="flex-container" id="model-input-area">
            <div className="flex-item-left container" id="timeline">
                <div id="timeline-area">
                    <ol>
                        <li>
                            <h3 class="timeline-title">{this.props.dataControllerState.userFilters.predictiveModelDate - 2}</h3>
                            <span class="point"></span>
                            <div>
                                <center>
                                    <TimelineInput disabled={this.props.editing} instructions="Spots" submitFunction={this.props.updateSpotst2Selection} valueToDisplay={this.props.inputs.spotst2 !== null ? this.props.inputs.spotst2 : "null"} ref={this.props.spotst2Input} color={this.props.color} />
                                </center>
                            </div>
                        </li>
                        <li id="special-li-timeline">
                            <h3 class="timeline-title">{this.props.dataControllerState.userFilters.predictiveModelDate - 1}</h3>
                            <span class="point"></span>
                            <div>
                                <center>
                                    <TimelineInput disabled={this.props.editing} instructions="Clerids" submitFunction={this.props.updateCleridst1Selection} valueToDisplay={this.props.inputs.cleridst1 !== null ? this.props.inputs.cleridst1 : "null"} ref={this.props.cleridst1Input} color={this.props.color} /><TimelineInput disabled instructions="Spots" submitFunction={this.props.updateSpotst1Selection} valueToDisplay={this.props.inputs.spotst1 !== null ? this.props.inputs.spotst1 : "null"} ref={this.props.spotst1Input} color={this.props.color} />
                                </center>
                            </div>
                        </li>
                        <li id="special-li-timeline">
                            <h3 class="timeline-title">{"Spring " + this.props.dataControllerState.userFilters.predictiveModelDate}</h3>
                            <span class="point"></span>
                            <div>
                                <center>
                                    <TimelineInput disabled={this.props.editing} instructions="SPB" submitFunction={this.props.updateSPBSelection} valueToDisplay={this.props.inputs.SPB !== null ? this.props.inputs.SPB : "null"} ref={this.props.SPBInput} color={this.props.color} /><TimelineInput disabled instructions="endobrev" submitFunction={this.updateEndobrevSelection} valueToDisplay={this.props.inputs.endobrev !== null ? this.props.inputs.endobrev : "null"} ref={this.props.endobrevInput} color={this.props.color} />
                                </center>
                            </div>
                        </li>
                        <li id="timeline-button">
                            <div className="description" id="timeline-button-description">
                                <table>
                                    <tr>
                                        {this.props.buttons}
                                    </tr>
                                </table>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="flex-item-right container" id="box-info-area">
                <h3 className="timeline-title">{"Summer " + this.props.dataControllerState.userFilters.predictiveModelDate}</h3>
                <span class="point"></span>
                <div class="summer_line"></div>
                <div id="print-model-outputs">
                    <h2>Predictions</h2><br />
                    <p>{"# of Spots in " + (this.props.dataControllerState.userFilters.predictiveModelDate) + ": "}<strong>{this.props.dataControllerState.predictiveModelInputs.spotst1}</strong></p>
                    <p>{"Probability of Any Spots: "}<strong style={{color: "red"}}>{(this.props.dataControllerState.predictiveModelOutputs.prob0spots*100).toFixed(2) + "%"}</strong></p>
                </div>
            </div>
        </div>
        );
    }
}

export default ModelInputTab;