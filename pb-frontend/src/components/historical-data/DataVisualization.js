import React, { Component } from 'react';
import '../../styles/historical-data/DataVisualization.css';
import {Line} from 'react-chartjs-2';

class DataVisualization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            totalCleridsPerTwoWeeks: 0,
            totalSPBPerTwoWeeks: 0,
            avgPercentSPB: 0,
            totalSpots: 0,
            totalSpotsPerHundredKM: 0,
            chartData: {
                labels: [],
                datasets: [
                    {
                        data: [],
                        label: "Total Spots",
                        borderColor: "#1f77b4",
                        fill: false
                    },
                    {
                        data: [],
                        label: "Total SPB Per Two Weeks",
                        borderColor: "#ff7f0e",
                        fill: false
                    },
                    {
                        data: [],
                        label: "Total Clerids Per Two Weeks",
                        borderColor: "#2ca02c",
                        fill: false
                    }
                ]
            }, // used for chartjs line chart
        }

        this.updateStateFromProps = this.updateStateFromProps.bind(this);
    }
    render() {
        return(
            <div>
                <div id="beetle-count-area" className="flex-item-left">
                    <h2 id="total-clerids-per-two-weeks">{"Total Clerids Per Two Weeks: " + this.state.totalCleridsPerTwoWeeks}</h2>
                    <h2 id="total-spb-per-two-weeks">{"Total SPB Per Two Weeks: " + this.state.totalSPBPerTwoWeeks}</h2>
                    <h2 id="avg-percent-spb">{"Average Percent SPB: " + this.state.avgPercentSPB + "%"}</h2>
                    <h2 id="total-spots">{"Total Spots: " + this.state.totalSpots}</h2>
                    <h2 id="total-spots-per-hundred-km">{"Total Spots Per Hundred KM: " + this.state.totalSpotsPerHundredKM}</h2>
                </div>
                <div id="chartjs-container" className="flex-item-left">
                    <Line
                        data={this.state.chartData}
                        height={400}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                yAxes : [{
                                    ticks : {
                                        max : 1000,
                                        min : 0
                                    }
                                }]
                            }
                        }}
                    />
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
        if (this.props.data !== nextProps.data) {
            this.updateStateFromProps(nextProps);
        }
    }

    // recalculate values to show on page
    updateStateFromProps(props) {
        var totalCleridsPerTwoWeeks = 0;
        var totalSPBPerTwoWeeks = 0;
        var totalPercentSPB = 0;
        var totalSpots = 0;
        var totalSpotsPerHundredKM = 0;

        for (var obj in props.data) {
            totalCleridsPerTwoWeeks += props.data[obj].cleridsPerTwoWeeks;
            totalSPBPerTwoWeeks += props.data[obj].spbPerTwoWeeks;
            totalPercentSPB += props.data[obj].percentSpb;
            totalSpots += props.data[obj].spots;
            totalSpotsPerHundredKM += props.data[obj].spotsPerHundredKm;
        }

        // sort data based on year
        props.data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0));

        // construct totalSpotsData
        var totals = [[],[],[]]
        for (var i in props.data) {
            if (props.data[i].spots != null) {
                totals[0].push(props.data[i].spots)
            }
            if (props.data[i].spbPerTwoWeeks != null) {
                totals[1].push(props.data[i].spbPerTwoWeeks)
            }
            if (props.data[i].cleridsPerTwoWeeks != null) {
                totals[2].push(props.data[i].cleridsPerTwoWeeks)
            }
        }

        this.state.chartData.datasets[0].data = totals[0]
        this.state.chartData.datasets[1].data = totals[1]
        this.state.chartData.datasets[2].data = totals[2]

        this.setState({
            totalCleridsPerTwoWeeks: parseInt(totalCleridsPerTwoWeeks.toLocaleString()), // toLocalString adds commas for thousands places
            totalSPBPerTwoWeeks: parseInt(totalSPBPerTwoWeeks.toLocaleString()),
            avgPercentSPB: parseInt(totalPercentSPB / props.data.length.toFixed(3)), // toFixed is number of decimal places
            totalSpots: parseInt(totalSpots.toLocaleString()),
            totalSpotsPerHundredKM: parseInt(totalSpotsPerHundredKM.toLocaleString())
        });
    }
}

export default DataVisualization
