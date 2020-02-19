import React, { Component } from 'react';
import '../../styles/predictive-model-page/PredictionsVersusOutcome.css';

export default class PredictionVsOutcome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confidence: 'high'
        }

        this.calculateConfidence();
    }

    /**
     * This method will calculate the confidence of a given prediction
     * by finding the percentage error between the predicted and grouth
     * truth number of recorded spot.
     * @calculateConfidence
     */

    calculateConfidence() {
        this.props.prediction().then((res) => {
            const outputs = res.outputs;

            let previousKey = "0";

            for (const key in outputs) {
                var probability = outputs[key];

                // once the probability becomes less than 50%, each subsequent reading becomes less probable
                if(probability <= 0.5) {
                    // use regex to extract out the integer from key e.g. prob50spots -> '50'
                    const prevProbability = parseInt(previousKey.match("([0-9]+)")[0]);
                    const currentProbability = parseFloat(key.match("([0-9]+)")[0]);
                    const predictedValue = (currentProbability + prevProbability) / 2;
                    const actualValue = Math.max(parseFloat(outputs["expSpotsIfOutbreak"]), 1);

                    // error is calculated as the percentage error of the predicted and known value
                    const error = Math.abs(actualValue - predictedValue) / actualValue;

                    /*console.log(prevProbability);
                    console.log(currentProbability);
                    console.log("Value between " + previousKey + " and " + key);
                    console.log("Predicted Value: " + predictedValue);
                    console.log("Percentage Error: " + error)*/

                    let confidenceLevel = 'low'

                    if(error <= 0.5) {
                        confidenceLevel = 'high';
                    }

                    this.setState({
                        confidence: confidenceLevel,
                        percentageError: error,
                    });

                    break;
                }

                previousKey = key;
            }
        });
    }

    render() {
        return (
            <center>
                <div className="container">
                    <div className="classification_information">
                        <h1>How well did we do?</h1>
                        <div className="classification_prediction">
                            <img src={ require('../../assets/check.png') } alt="Cross" />
                            <div className="information">
                                <h2>Prediction</h2>
                                <h3>If our model predicted an outbreak.</h3>
                            </div>
                        </div>
                        <div className="classification_actual">
                            <img src={ require('../../assets/no-waiting.png') } alt="Cross" />
                            <div className="information">
                                <h2>Actual</h2>
                                <h3>If there was actually an outbreak.</h3>
                            </div>
                        </div>
                   </div>
                </div>
            </center>
        );
    }
}