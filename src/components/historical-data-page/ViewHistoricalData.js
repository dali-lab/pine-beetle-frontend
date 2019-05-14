import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer';
import HistoricalDataSelectionBar from '../selection-bars/HistoricalDataSelectionBar';
import LineChartArea from './LineChartArea';
import MapBoxMap from './mapbox/MapBoxMap';
import ReactTooltip from 'react-tooltip'
import math from 'mathjs';
import '../../styles/historical-data-page/ViewHistoricalData.css';

class ViewHistoricalData extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null,  // defines the user's current selection for state, national forest, etc.
            spotsMean: 0,
            spotsSD: 0,
            spbMean: 0,
            spbSD: 0,
            cleridsMean: 0,
            cleridsSD: 0
        }

        // bind functions and create references
        this.movePredictionModelDown = this.movePredictionModelDown.bind(this);
        this.containerComponent = React.createRef();
    }
    render() {
        if (this.state.dataController != null && this.state.dataControllerState != null && this.state.dataControllerState.historicalData.summarizedDataByYear !== null && this.state.dataControllerState.historicalData.summarizedDataByLatLong !== null) {
            return(
                <div ref={this.containerComponent}>
                    <HistoricalDataSelectionBar dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} movePredictionModelDown={this.movePredictionModelDown}/>
                    <div className="flex-container" id="map-area-container">
                        <div className="flex-item container" id="line-container">
                            <LineChartArea data={this.state.dataControllerState.historicalData.summarizedDataByYear} firstObservedYear={this.state.dataControllerState.userFilters.startDate} lastObservedYear={this.state.dataControllerState.userFilters.endDate} />
                        </div>
                        <div id="mapbox-container">
                            <MapBoxMap summarizedDataByLatLong={this.state.dataControllerState.historicalData.summarizedDataByLatLong} />
                        </div>
        			</div>
                    <div className="container" id="line-metrics-area">
                        <table>
                            <tr>
                                <th>
                                    <p data-tip="Sample Mean of Spots"><b>Spots Mean: </b>{this.state.spotsMean.toLocaleString()}</p>
                                    <p data-tip="Standard Deviation of Spots"><b>Spots SD: </b>{this.state.spotsSD.toLocaleString().slice(0, -1)}</p>
                                </th>
                                <th>
                                    <p data-tip="Sample Mean of SPB"><b>SPB Mean: </b>{this.state.spbMean.toLocaleString()}</p>
                                    <p data-tip="Standard Deviation of SPB"><b>SPB SD: </b>{this.state.spbSD.toLocaleString().slice(0, -1)}</p>
                                </th>
                                <th>
                                    <p data-tip="Sample Mean of Clerids"><b>Clerids Mean: </b>{this.state.cleridsMean.toLocaleString()}</p>
                                    <p data-tip="Standard Deviation of Clerids"><b>Clerids SD: </b>{this.state.cleridsSD.toLocaleString().slice(0, -1)}</p>
                                </th>
                            </tr>
                        </table>
                        <ReactTooltip />
                    </div>
        		</div>
            );
        }

        else {
            return <LoadingContainer />
        }
    }

    // <MapBoxMap summarizedDataByLatLong={this.state.dataControllerState.historicalData.summarizedDataByLatLong} />

    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if receiving new data, update the state
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    updateStateFromProps(props) {
        if (props.dataController !== undefined && props.dataController != null) {
            this.setState({
                dataController: props.dataController.current
            });
        }

        if (props.dataControllerState !== undefined && props.dataControllerState != null) {
            this.setState({
                dataControllerState: props.dataControllerState
            });

            // data={this.state.dataControllerState.historicalData.summarizedDataByYear}
            // firstObservedYear={this.state.dataControllerState.userFilters.startDate} lastObservedYear={this.state.dataControllerState.userFilters.endDate}

            if (props.dataControllerState.historicalData.summarizedDataByYear !== null) {
                if (props.dataControllerState.historicalData.summarizedDataByYear !== 0) {

                    // initialize data arrays
                    var spots = []
                    var spb = []
                    var clerids = []
    
                    // initialize start and end date
                    var startDate = props.dataControllerState.userFilters.startDate;
                    var endDate = props.dataControllerState.userFilters.endDate;
    
                    // initialize sum for each year
                    for (var yearNum = 0; yearNum <= (parseInt(endDate) - parseInt(startDate)); yearNum++) {
                        spots[yearNum] = 0
                        spb[yearNum] = 0
                        clerids[yearNum] = 0
                    }
    
                    // add data to object
                    for (var i in props.dataControllerState.historicalData.summarizedDataByYear) {
                        var year = props.dataControllerState.historicalData.summarizedDataByYear[i].year
                        yearNum = year - startDate
    
                        // update spots count
                        if (props.dataControllerState.historicalData.summarizedDataByYear[i].spots != null && !isNaN(props.dataControllerState.historicalData.summarizedDataByYear[i].spots) && props.dataControllerState.historicalData.summarizedDataByYear[i].spots !== undefined) {
                            spots[yearNum] += props.dataControllerState.historicalData.summarizedDataByYear[i].spots
                        }
    
                        // update spb per two weeks count
                        if (props.dataControllerState.historicalData.summarizedDataByYear[i].spbPerTwoWeeks != null && !isNaN(props.dataControllerState.historicalData.summarizedDataByYear[i].spbPerTwoWeeks) && props.dataControllerState.historicalData.summarizedDataByYear[i].spbPerTwoWeeks !== undefined) {
                            spb[yearNum] += props.dataControllerState.historicalData.summarizedDataByYear[i].spbPerTwoWeeks
                        }
    
                        // update clerids per two weeks count
                        if (props.dataControllerState.historicalData.summarizedDataByYear[i].cleridsPerTwoWeeks != null && !isNaN(props.dataControllerState.historicalData.summarizedDataByYear[i].cleridsPerTwoWeeks) && props.dataControllerState.historicalData.summarizedDataByYear[i].cleridsPerTwoWeeks !== undefined) {
                            clerids[yearNum] += props.dataControllerState.historicalData.summarizedDataByYear[i].cleridsPerTwoWeeks
                        }
                    }

                    spb = spb.filter(item => !isNaN(item));
                    clerids = clerids.filter(item => !isNaN(item));
                    spots = spots.filter(item => !isNaN(item));
    
                    var spotsMean = 0;
                    var spotsSD = 0;
                    var spbMean = 0;
                    var spbSD = 0;
                    var cleridsMean = 0;
                    var cleridsSD = 0;
    
                    // compute mean and standard deviations
                    if (spots.length > 0) {
                        spotsMean = math.mean(spots)
                        spotsSD = math.std(spots)
                    }
                    if (spb.length > 0) {
                        spbMean = math.mean(spb)
                        spbSD = math.std(spb)
                    }
                    if (clerids.length > 0) {
                        cleridsMean = math.mean(clerids)
                        cleridsSD = math.std(clerids)
                    }
    
                    // update state
                    this.setState({
                        spotsMean: spotsMean,
                        spotsSD: spotsSD,
                        spbMean: spbMean,
                        spbSD: spbSD,
                        cleridsMean: cleridsMean,
                        cleridsSD: cleridsSD
                    });
                }
            }
        }
    }

    // move the prediction model down
    movePredictionModelDown() {
        // grab references
        var area1 = this.containerComponent.current.children[1];
        var area2 = this.containerComponent.current.children[2];

        // remove
        this.containerComponent.current.removeChild(area1);
        this.containerComponent.current.removeChild(area2);

        // add
        this.containerComponent.current.appendChild(area2);
        this.containerComponent.current.appendChild(area1);
    }
}

export default ViewHistoricalData
