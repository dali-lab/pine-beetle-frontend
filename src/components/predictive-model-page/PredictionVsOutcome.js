import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import '../../styles/predictive-model-page/PredictionsVersusOutcome.css';


export default class PredictionVsOutcome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confidence: 'high'
        }

        this.calculateConfidence();
    }

    calculateConfidence() {
        console.log("calculating confidence...");
        this.props.prediction().then((res) => {
            const outputs = res.outputs;

            let previousKey = "0";

            for (const key in outputs) {
                var probability = outputs[key];

                if(probability <= 0.5) {
                    // line of likelihood reached
                    const prevProbability = parseInt(previousKey.match("([0-9]+)")[0]);
                    const currentProbability = parseInt(key.match("([0-9]+)")[0]);
                    const predictedValue = (currentProbability + prevProbability) / 2;

                    console.log(prevProbability);
                    console.log(currentProbability);

                    console.log("Value between " + previousKey + " and " + key);
                    console.log("Predicted Value: " + predictedValue)
                    break;
                }

                previousKey = key;
            }

            console.log(res);
        });
    }

    render() {
        return (
            <center>
                <div className="container" style={{ backgroundColor: '#F2F5E8' }}>
                    <div className="classification_information">
                        { (this.state.confidence === 'high') ? <img src={ require('../../assets/shield.png') } alt="Shield" /> : <img src={ require('../../assets/man.png') } alt="Man" /> }
                        <p>Our model has a <b>{ this.state.confidence }</b> confidence rating for this prediction; we base this on a number of factors including the size of the error or prediction vs. actual outcome and previous historical data.</p>
                    </div>
                </div>
            </center>
        );
    }
}