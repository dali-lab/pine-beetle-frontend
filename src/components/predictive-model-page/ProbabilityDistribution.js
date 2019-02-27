import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';
import RunningModel from '../RunningModel';
import '../../styles/predictive-model-page/ProbabilityDistribution.css';

class ProbabilityDistribution extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData: {
                labels: [">0 Spots", ">19 Spots", ">53 Spots", ">147 Spots", ">402 Spots", ">1095 Spots"],
                datasets: [
                    {
                        data: [],
                        label: "Probability of Spots",
                        backgroundColor: "#1f77b4",
                        hoverBackgroundColor: "#CCE1B6"
                    }
                ]
            }, // used for chartjs line chart
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    yAxes : [{
                        ticks : {
                            max : 1,
                            min : 0
                        }
                    }]
                },
                legend: {
                    display: false
                 },
            },
            outputs: {
                expSpotsIfOutbreak: 0,
                prob0spots: 0,
                prob19spots: 0,
                prob53spots: 0,
                prob147spots: 0,
                prob402spots: 0,
                prob1095spots: 0
            }
        }

        this.updateStateFromProps = this.updateStateFromProps.bind(this);
    }
    render() {
        if (!this.props.dataControllerState.runningModel) {
            var visualization = <Bar data={this.state.chartData} height={400} options={this.state.chartOptions}/>
        }
        else {
            visualization = <RunningModel dataControllerState={this.props.dataControllerState} />
        }

        return(
            <div className="flex-container">
                <div className="container probability-distribution flex-item-left" id="probability-distribution">
                    {visualization} 
                </div>
                <div className="container flex-item flex-item-right" id="probability-metrics-area">
                    <h4>Note on Statistics:</h4>
                    <br />
                    <p>The predictive model gives the probability for various levels of southern pine beetle spot severity. For example, the probability that the number of spots is between 20 and 53. In addition, it gives the expected number of spots if any. Please note that the model is probabilistic. An outcome with a low probability may nevertheless occur. The model also places special emphasis on three figures: the probability of any spots, the expected number of spots if any, and the probability of more than 53 spots. We emphasize probability of more than 53 spots because we consider it a signifier of a “bad” outcome, though various forest professional may use another benchmark.</p>
                </div>
            </div>
        );
    }

    // on mount, update the state
    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if we are receiving new data, update the state before rendering
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // recalculate values to show on page
    updateStateFromProps(props) {
        this.setState({
            outputs: props.data
        });

        var data = [props.data.prob0spots, props.data.prob19spots, props.data.prob53spots, props.data.prob147spots, props.data.prob402spots, props.data.prob1095spots];

        if (props.data !== null) {
            if (props.data.length !== 0) {
                var chartData = Object.assign({}, this.state.chartData);
                chartData.datasets[0].data = data;

                var colors = ['#FFF072', '#FFD850', '#FFA930', '#FF7B21', '#FF2000', '#F00000', '#CA000E', '#880021', '#560019', '#000000']

                if (data[0] <= 0.10) {
                    chartData.datasets[0].backgroundColor = colors[0];
                }
                else if (data[0] > 0.10 && data[0] <= 0.20) {
                    chartData.datasets[0].backgroundColor = colors[1];
                }
                else if (data[0] > 0.20 && data[0] <= 0.30) {
                    chartData.datasets[0].backgroundColor = colors[2];
                }
                else if (data[0] > 0.30 && data[0] <= 0.40) {
                    chartData.datasets[0].backgroundColor = colors[3];
                }
                else if (data[0] > 0.40 && data[0] <= 0.50) {
                    chartData.datasets[0].backgroundColor = colors[4];
                }
                else if (data[0] > 0.50 && data[0] <= 0.60) {
                    chartData.datasets[0].backgroundColor = colors[5];
                }
                else if (data[0] > 0.60 && data[0] <= 0.70) {
                    chartData.datasets[0].backgroundColor = colors[6];
                }
                else if (data[0] > 0.70 && data[0] <= 0.80) {
                    chartData.datasets[0].backgroundColor = colors[7];
                }
                else if (data[0] > 0.80 && data[0] <= 0.90) {
                    chartData.datasets[0].backgroundColor = colors[8];
                }
                else {
                    chartData.datasets[0].backgroundColor = colors[9];
                }

                // update state
                this.setState({
                    chartData: chartData
                });
            }
        }
    }
}

export default ProbabilityDistribution
