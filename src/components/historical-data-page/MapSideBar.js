import React, { Component } from 'react';
import '../../styles/historical-data-page/MapSideBar.css';

class MapSideBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            beetleCounts: {
                totalCleridsPerTwoWeeks: 0,
                totalSPBPerTwoWeeks: 0,
                totalSpots: 0,
                totalSpotsPerHundredKM: 0
            },
            areaTitle: [<h3 key={0}>{"United States"}</h3>]
        }

        this.updateStateFromProps = this.updateStateFromProps.bind(this);
    }
    render() {
        return(
            <div id="map-side-bar-container">
                <div id="area-title">
                    {this.state.areaTitle}
                </div>
                <div id="beetle-counts">
                    <p id="total-clerids-per-two-weeks">{"Total Clerids Per Two Weeks: " + this.state.beetleCounts.totalCleridsPerTwoWeeks}</p>
                    <p id="total-spb-per-two-weeks">{"Total SPB Per Two Weeks: " + this.state.beetleCounts.totalSPBPerTwoWeeks}</p>
                    <p id="total-spots">{"Total Spots: " + this.state.beetleCounts.totalSpots}</p>
                    <p id="total-spots-per-hundred-km">{"Total Spots Per Hundred KM: " + this.state.beetleCounts.totalSpotsPerHundredKM}</p>
                </div>
                <div id="sidebar-button-area">
                    <button id="reset-current-data-button" className="submit static-button" onClick={this.props.clearFunction}>Clear Filters</button>
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
        var totalSpots = 0;
        var totalSpotsPerHundredKM = 0;

        for (var obj in props.data) {
            totalCleridsPerTwoWeeks += props.data[obj].cleridsPerTwoWeeks;
            totalSPBPerTwoWeeks += props.data[obj].spbPerTwoWeeks;
            totalSpots += props.data[obj].spots;
            totalSpotsPerHundredKM += props.data[obj].spotsPerHundredKm;
        }

        // format nicely
        totalCleridsPerTwoWeeks = parseInt(totalCleridsPerTwoWeeks).toLocaleString(); // toLocalString adds commas for thousands places
        totalSPBPerTwoWeeks = parseInt(totalSPBPerTwoWeeks).toLocaleString();
        totalSpots = parseInt(totalSpots).toLocaleString();
        totalSpotsPerHundredKM = parseInt(totalSpotsPerHundredKM).toLocaleString();

        var areaTitle = [];

        if (this.props.stateName != null) {
            areaTitle.push(<h3 key={0}>{"State: " + this.props.stateName}</h3>)
        }
        else {
            areaTitle.push(<h3 key={0}>{"United States"}</h3>)
        }

        if (this.props.nationalForest != null) {
            areaTitle.push(<h3 key={1}>{"National Forest: " + this.props.nationalForest}</h3>)
        }

        if (this.props.forest != null) {
            areaTitle.push(<h3 key={2}>{"Local Forest: " + this.props.forest}</h3>)
        }

        this.setState({
            beetleCounts: {
                totalCleridsPerTwoWeeks: totalCleridsPerTwoWeeks,
                totalSPBPerTwoWeeks: totalSPBPerTwoWeeks,
                totalSpots: totalSpots,
                totalSpotsPerHundredKM: totalSpotsPerHundredKM
            },
            areaTitle: areaTitle
        });
    }
}

export default MapSideBar
