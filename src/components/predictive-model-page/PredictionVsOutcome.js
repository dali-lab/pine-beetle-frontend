import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import '../../styles/predictive-model-page/PredictionsVersusOutcome.css';


export default class PredictionVsOutcome extends Component {
    render() {
        // Math.abs(this.data.datasets.data[0] - this.data.datasets[1])
        this.data = {
            labels: ['Predicted No. of Spots', 'Recorded No. of Spots', 'Error'],
            datasets: [{
                data: [2378, 2454, 100],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.6)',
                    'rgba(52, 152, 219, 0.6)',
                    'rgba(231, 76, 60, 0.6)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        };

        this.options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    barPercentage: 0.4,
                }]
            },
            legend: {
                display: false
             },
        };

        return (
            <center>
                <div className="container">
                    <div className="flex-container grow-container" >
                        <div className="pvo_information">
                            <h2>Accuracy and Precision of the Model</h2><br />
                            <Bar data={this.data} height={400} options={this.options}/>
                        </div>
                        <div className="pvo_classification">
                            <div className="classification_information">
                                <img src={ require('../../assets/man.png') } alt="Shield" />
                                <p>Our model has a <b>low</b> confidence rating for this prediction; we base this on a number of factors including the size of the error or prediction vs. actual outcome and previous historical data.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        );
    }
}