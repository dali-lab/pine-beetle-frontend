import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';
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
                        hoverBackgroundColor: "#e9c46a"
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
                }
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
        return(
            <div className="flex-container">
                <div className="container probability-distribution flex-item flex-item-left" id="probability-distribution">
                        <Bar data={this.state.chartData} height={400} options={this.state.chartOptions}/>
                </div>
                <div className="container flex-item flex-item-right" id="probability-metrics-area">
                    <h3>Expected Spots If Outbreak: <span className="no-bold">{this.state.outputs.expSpotsIfOutbreak !== null ? this.state.outputs.expSpotsIfOutbreak.toFixed(3) : "null"}</span></h3>
                    <br />
                    <h3>Probability &gt; 0 Spots: <span className="no-bold">{this.state.outputs.prob0spots !== null ? this.state.outputs.prob0spots.toFixed(3) : "null"}</span></h3>
                    <h3>Probability &gt; 19 Spots: <span className="no-bold">{this.state.outputs.prob19spots !== null ? this.state.outputs.prob19spots.toFixed(3) : "null"}</span></h3>
                    <h3>Probability &gt; 53 Spots: <span className="no-bold">{this.state.outputs.prob53spots !== null ? this.state.outputs.prob53spots.toFixed(3) : "null"}</span></h3>
                    <h3>Probability &gt; 147 Spots: <span className="no-bold">{this.state.outputs.prob147spots !== null ? this.state.outputs.prob147spots.toFixed(3) : "null"}</span></h3>
                    <h3>Probability &gt; 402 Spots: <span className="no-bold">{this.state.outputs.prob402spots !== null ? this.state.outputs.prob402spots.toFixed(3) : "null"}</span></h3>
                    <h3>Probability &gt; 1095 Spots: <span className="no-bold">{this.state.outputs.prob1095spots !== null ? this.state.outputs.prob1095spots.toFixed(3) : "null"}</span></h3>
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
        })

        var data = []

        for (var key in props.data) {
            data.push(props.data[key]);
        }

        // remove first value from array (exp spots)
        data.shift();

        if (props.data !== null) {
            if (props.data.length !== 0) {
                var chartData = Object.assign({}, this.state.chartData);
                chartData.datasets[0].data = data;

                // blue
                if (data[0] <= 0.33) {
                    chartData.datasets[0].backgroundColor = "#1f77b4";
                }
                // orange
                else if (data[0] > 0.33 && data[0] <= 0.66) {
                    chartData.datasets[0].backgroundColor = "#FF912B";
                }
                // red
                else {
                    chartData.datasets[0].backgroundColor = "#E31A1C";
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
