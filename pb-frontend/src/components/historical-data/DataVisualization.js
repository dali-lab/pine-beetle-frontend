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
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    yAxes : [{
                        ticks : {
                            max : 1000,
                            min : 0
                        }
                    }]
                }
            }
        }

        this.updateStateFromProps = this.updateStateFromProps.bind(this);
    }
    render() {
        return(
            <div>
                <div id="chartjs-container">
                    <Line data={this.state.chartData} height={500} options={this.state.chartOptions}/>
                </div>
                <div id="beetle-count-area">
                    <p id="total-clerids-per-two-weeks">{"Total Clerids Per Two Weeks: " + this.state.totalCleridsPerTwoWeeks}</p>
                    <p id="total-spb-per-two-weeks">{"Total SPB Per Two Weeks: " + this.state.totalSPBPerTwoWeeks}</p>
                    <p id="avg-percent-spb">{"Average Percent SPB: " + this.state.avgPercentSPB + "%"}</p>
                    <p id="total-spots">{"Total Spots: " + this.state.totalSpots}</p>
                    <p id="total-spots-per-hundred-km">{"Total Spots Per Hundred KM: " + this.state.totalSpotsPerHundredKM}</p>
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
        // text fields
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

        // // sort data based on year
        // props.data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year >= a.year) ? -1 : 0));

        // create data object for line chart
        var chartData = {
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
        }

        // initialize data arrays
        var spots = []
        var spb = []
        var clerids = []

        // add array for each year
        for (var year = 0; year < (new Date()).getFullYear(); year++) {
            spots[year] = []
            spb[year] = []
            clerids[year] = []
        }

        // add data and labels to object
        for (var i in props.data) {
            var year = props.data[i].year
            // update spots count
            if (props.data[i].spots != null) {
                spots[year].push(props.data[i].spots)
            }

            // update spb per two weeks count
            if (props.data[i].spbPerTwoWeeks != null) {
                spb[year].push(props.data[i].spbPerTwoWeeks)
            }

            // update clerids per two weeks count
            if (props.data[i].cleridsPerTwoWeeks != null) {
                clerids[year].push(props.data[i].cleridsPerTwoWeeks)
            }

            // add to the line chart's label if we haven't yet found this day
            if (!chartData.labels.includes(year)) {
                chartData.labels.push(year);
            }
        }

        // clear out data arrays of empty years
        for (var year = 0; year < (new Date()).getFullYear(); year++) {
            if (spots[year].length > 0) {
                var sum = 0;
                for (var i in spots[year]) {
                    sum += spots[year][i]
                }
                chartData.datasets[0].data.push(sum)
            }

            if (spb[year].length > 0) {
                var sum = 0;
                for (var i in spb[year]) {
                    sum += spb[year][i]
                }
                chartData.datasets[1].data.push(sum)
            }

            if (clerids[year].length > 0) {
                var sum = 0;
                for (var i in clerids[year]) {
                    sum += clerids[year][i]
                }
                chartData.datasets[2].data.push(sum)
            }
        }

        // maximum value found in the array
        var max = 0

        // adjust y-axis height
        for (var entry in chartData.datasets[0].data) {
            if (chartData.datasets[0].data[entry] > max) {
                max = chartData.datasets[0].data[entry]
            }
        }
        for (var entry in chartData.datasets[1].data) {
            if (chartData.datasets[1].data[entry] > max) {
                max = chartData.datasets[1].data[entry]
            }
        }
        for (var entry in chartData.datasets[2].data) {
            if (chartData.datasets[2].data[entry] > max) {
                max = chartData.datasets[2].data[entry]
            }
        }

        // set new y-axis height
        this.state.chartOptions.scales.yAxes[0].ticks.max = max

        // update state
        this.setState({
            totalCleridsPerTwoWeeks: parseInt(totalCleridsPerTwoWeeks.toLocaleString()), // toLocalString adds commas for thousands places
            totalSPBPerTwoWeeks: parseInt(totalSPBPerTwoWeeks.toLocaleString()),
            avgPercentSPB: parseInt(totalPercentSPB / props.data.length.toFixed(3)), // toFixed is number of decimal places
            totalSpots: parseInt(totalSpots.toLocaleString()),
            totalSpotsPerHundredKM: parseInt(totalSpotsPerHundredKM.toLocaleString()),
            chartData: chartData
        });
    }
}

export default DataVisualization
