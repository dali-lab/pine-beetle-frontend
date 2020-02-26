import React, { Component } from 'react';
import '../../../styles/predictive-model-page/PredictiveMap.css';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
var printPdf = require('mapbox-print-pdf');
require('dotenv').config() // load mapbox access token

class PredictiveMap extends Component {
    constructor(props) {
        super(props)
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

        this.state = {
            map: null,
            dataController: null,
            dataControllerState: null,
            thresholds: ['0%-1%', '1%-1.7%', '1.7%-2.8%', '2.8%-4.6%', '4.6%-7.7%', '7.7%-13%', '13%-22%', '22%-36%', '36%-60%', '60%-100%'],
            colors: ['#4776b3', '#6F90B6', '#9AAEBC', '#C0CCBE', '#E9ECC0', '#FEE8B0', '#F9B988', '#F08D66', '#E46149', '#D4312E'],
            legendTags: [],
            hoverElement: <p>{"Hover over a forest for detailed information"}</p>
        }

        this.createMap = this.createMap.bind(this);
        this.downloadMap = this.downloadMap.bind(this);
        this.updateChoroplethLayer = this.updateChoroplethLayer.bind(this);
        this.colorStates = this.colorStates.bind(this);
        this.returnMapName = this.returnMapName.bind(this);
        this.buildFooter = this.buildFooter.bind(this);
        this.buildHeader = this.buildHeader.bind(this);
        this.printMap = this.buildPrintMap.bind(this);
    }

    render() {
        return(
            <div className="container flex-item-left" id="map-container">
                <div id="map"></div>
                <div className='map-overlay-hover-area' id='features'>
                    <h3>Predictions By Forest</h3>
                    <div id='pd'>
                        {this.state.hoverElement}
                    </div>
                </div>
                <div className='map-overlay-legend' id='legend'>
                <div className='legend-key-title'><strong>Probability of >50 spots</strong></div>
                    {this.state.legendTags}
                </div>
                <div id="printmap"></div>
            </div>
        );
    }

    componentWillMount() {
        this.updateStateFromProps(this.props);
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
        
        // Calls function to download map when download control is clicked
        document.addEventListener('click', (event) => {
            if (!event.target.matches('.download-button')) return;
            this.downloadMap();
        }, false);

        // Calls function to download map when download control is clicked
        document.addEventListener('click', (event) => {
            if (!event.target.matches('.download-button p')) return;
            this.downloadMap();
        }, false);
    }

    // if receiving new data, update the state
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    updateStateFromProps(props) {   
        this.setState({
            dataController: props.dataController,
            dataControllerState: props.dataControllerState
        }, () => {
            if (this.state.dataControllerState.historicalData.summarizedDataByState !== null) {
                if (this.state.map === null) {
                    this.createMap();
                }
                else {
                    this.updateChoroplethLayer();
                }
            }
        })
    }

    createMap() {
        if (this.state.map === null) {
            this.setState({
                map: new mapboxgl.Map({
                    container: 'map', // container id
                    // style: 'mapbox://styles/mapbox/streets-v9',
                    style: 'mapbox://styles/pine-beetle-prediction/ck2kl9kcy4vvb1cjyf23s2ars',
                    center: [-84.3880,33.7490], // starting position
                    zoom: 4.8, // starting zoom
                    options: {
                        trackResize: true
                    }
                })
            }, () => {
                if (this.state.map !== null && this.state.map._controls !== undefined) {
                    // if we haven't added a navigation control, add one
                    if (this.state.map._controls.length < 3) {
                        // Add zoom and rotation controls to the map.
                        this.state.map.addControl(new mapboxgl.NavigationControl());
                        this.state.map.addControl(new DownloadControl(), 'bottom-left'); // adds download button to map
                    }

                    // disable map zoom when using scroll
                    this.state.map.scrollZoom.disable();

                    var legendTags = []

                    // add legend tags
                    for (var i = 0; i < this.state.thresholds.length; i++) {
                        var layer = this.state.thresholds[i];
                        var color = this.state.colors[i];
                        var element = <div key={i} >
                                <span>{layer}</span>
                                <span className="legend-key" style={{backgroundColor: color}}></span>
                            </div>

                        legendTags.push(element)
                    }

                    this.setState({
                        legendTags: legendTags
                    });

                    if (this.state.map._listeners.mousemove === undefined) {
                        this.state.map.on('mousemove', function(e) {
                            if (this.state.map !== null) {
                                var forests = this.state.map.queryRenderedFeatures(e.point, {
                                    layers: ['forests-join']
                                });
        
                                let element;
        
                                if (forests.length > 0) {
                                    // get prediction for this state
                                    var probability = 0;
                                    for (var entry in this.state.dataControllerState.predictiveModelOutputArray) {
                                        var check = this.state.dataControllerState.predictiveModelOutputArray[entry].inputs.forest;

                                        if (check === forests[0].properties.forest.toUpperCase()) {
                                            probability = this.state.dataControllerState.predictiveModelOutputArray[entry].outputs.prob53spots;
                                        }
                                    }
                                    element = <div id="choropleth-map-p-area">
                                                <p><strong>{forests[0].properties.forest}</strong></p>
                                                <p>{probability*100 + "%"}</p>
                                            </div> 
                                }
                                else {
                                    element = <p>{"Hover over a forest for detailed information"}</p> 
                                }
        
                                this.setState({
                                    hoverElement: element
                                });
                            }   
                        }.bind(this));

                        // select state when user clicks on it
                        this.state.map.on('click', 'forests-join', function (e) {
                            this.state.dataController.updateForestSelection(e.features[0].properties.forest.toUpperCase())
                        }.bind(this));
                    }

                    this.updateChoroplethLayer();
                }
            });
        }
        else {
            this.updateChoroplethLayer();
        }
    }

    updateChoroplethLayer() {  
        this.state.map.resize();

        if (this.state.map._listeners.load === undefined) {
            this.state.map.on('load', function() {
                if (this.state.map.getSource("forests") === undefined) {
                    this.state.map.addSource("forests", {
                        type: "vector",
                        url: "mapbox://pine-beetle-prediction.1be58pyi"
                    });
                }

                this.colorStates();
            }.bind(this));
        }
        else if(this.state.map.isStyleLoaded()) {
            this.colorStates();
        } 
    }

    // Creates and returns a string to name the downloaded PDF
    // in the format 'StateYear.pdf"
    returnMapName() {
        return(`${this.state.dataControllerState.userFilters.stateName}${this.state.dataControllerState.userFilters.predictiveModelDate}`+'.pdf');
    }

    // Creates and returns an HTML object with information for the footer
    // of the downloaded maps. This includes a legend for the color scale,
    // notes explaining the legend and sources, and information about the
    // data collection process. This object is used by the mapbox-print-pdf library.
    buildFooter() {
        var title = `Southern  Pine  Beetle  Outbreak  Prediction  Maps:  ${this.state.dataControllerState.userFilters.stateName}  ${this.state.dataControllerState.userFilters.predictiveModelDate}`;
        var legendString = "";

        // creates the color boxes and text fields for the legend in the footer
        for (var i = 0; i < this.state.thresholds.length; i++) {
            var layer = this.state.thresholds[i];
            var color = this.state.colors[i];
            var spanString = `

            <div class="footer-legend-key" style="font-family: 'Open Sans', arial, serif;background: ${color};display: inline-block;border-radius: 20%;width: 20px;height: 20px;margin-right: 5px;margin-left: 5px;"></div><span>${layer}</span>`;
            legendString = legendString.concat(spanString);
        }

        return(
            `
            <div id="map-footer" style="text-align: center;letter-spacing: 1px;margin-top: 20px;margin-bottom: 0;">
                <div id="footer-legend" style="font-family: 'Open Sans', arial, serif;width: 51%;margin: auto;margin-bottom: 10px;">
                    ${legendString}
                </div>
                <p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height: 14px;width: 53%;margin: auto;margin-bottom: 16px;font-size: 14px;">Note: Color ramp ascends with a constant factor of 
                increase in the probability of outcome.</p>
                <div id="spacer" style="height: 50px;"></div>
                <h2 style="font-family: 'Open Sans', arial, serif;margin-bottom: 16px;margin-top: 16px;">${title}</h2>
                <p style="font-family: 'Open Sans', arial, serif;font-size: 14px;margin-bottom: 16px;">Predictions are based on a zero-inflated Poisson model fit to historical data 
                from 1988 – 2009 (Aoki 2017). The most important drivers of model predictions are
                 SPB trap captures in the current spring and SPB spots the previous year.
                </p>
                <p style="font-family: 'Open Sans', arial, serif;font-size: 14px;margin-bottom: 16px;">
                The SPB prediction project is supported by USDA Forest Service: Science and Technology 
                Development Program (STDP)
                </p>
                <p style="font-family: 'Open Sans', arial, serif;font-size: 14px;margin-bottom: 16px;">Contact: Matthew P. Ayres - matthew.p.ayres@dartmouth.edu; Carissa F. Aoki - caoki@bates.edu
                </p>
                <p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height: 14px;width: 53%;margin: auto;margin-bottom: 16px;font-size: 14px;">Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS,FAO, NPS, NRCAN, 
                GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, © OpenStreetMap 
                contributors, andthe GIS User Community</p>
            </div>
            `
        );
    }

    // Creates and returns an HTML object with the title for the header
    // of the downloaded maps. This object is used by the mapbox-print-pdf library.
    buildHeader() {
        return(
            `<div id="map-header" style="text-align: center;">
                <h2 style="letter-spacing: 1px;margin-top: 200px;margin-bottom: 50px;">Probability of (Any) SPB Spots</h2>
            </div>`
        );
    }

    // Makes design changes to the existing map and returns it to be saved by
    // the downloadMap() function. 
    buildPrintMap() {
        var printMap = this.state.map;
        
        // add source for counties name if it does not already exist
        var mapLayer = this.state.map.getSource('counties');
        if (typeof mapLayer == 'undefined') {
            printMap.addSource("counties", {
                type: "vector",
                url: "mapbox://pine-beetle-prediction.6ag6fs2a"
            });
        }

        var expression = ["match", ["upcase", ["get", "CountyWithState"]]];
        var textExpression = ["match", ["upcase", ["get", "CountyWithState"]]];
        var forestsAdded = [];
        
        // create expression to make the text size 10 for counties that have predicted data
        this.state.dataControllerState.predictiveModelOutputArray.forEach(function(row) {
            if (!forestsAdded.includes(row.inputs["forest"])) {
                expression.push(row.inputs["forest"], 10);
                textExpression.push(row.inputs["forest"], row.inputs["forest"].slice(0, -2))
                forestsAdded.push(row.inputs["forest"]);
            }
        });
        // default to no text size if no data exists for that county
        // this makes sure only colored-in counties have labels
        expression.push(0); 
        textExpression.push("");

        console.log(textExpression);

        // add county labels to the map, using the expression to make sure
        // only counties with data get labels
        printMap.addLayer({
            "id": "county-label",
            "type": "symbol",
            "source": "counties",
            "source-layer": "counties_for_labels-dlcufl",
            "layout": {
                "text-font": ["Open Sans Regular"],
                // "text-field": '{CountyWithoutState}',
                "text-field": textExpression,
                "text-size": expression
              }
        }, 'county-outlines');

        // hide city names so county names are not hidden due to overlap
        printMap.setLayoutProperty("settlement-label", "visibility", "none");
        // thicken state outlines to bring more focus to current state
        printMap.setPaintProperty("admin-1-boundary", "line-width", 4);

        return printMap;
    }

    // function to download map of currently selected data
    // connected to the onClick of the .download-button class
    downloadMap() {
        var mapName = this.returnMapName();
        var printMap = this.buildPrintMap();

        printPdf.build()
        .header({
            html: this.buildHeader(),
            baseline: {format: 'a3', orientation: 'p'}
        })
        .footer({
            html: this.buildFooter(),
            baseline: {format: 'a3', orientation: 'p'}
        })
        .margins({
            top: 8,
            right: 8,
            left: 8,
            bottom: 8
          }, "pt")
        .format('a3')
        .portrait() 
        .print(printMap, mapboxgl)
        .then(function(pdf) {
          pdf.save(mapName);
          // after saving, undo the design changes made by buildPrintMap() 
          // so they do not persist on the map shown on the website
          printMap.removeLayer("county-label");
          printMap.setLayoutProperty("settlement-label", "visibility", "visible");
          printMap.setPaintProperty("admin-1-boundary", "line-width", 0.75);
        });
    }

    colorStates() {
        // remove forests-join layer if already constructed
        var mapLayer = this.state.map.getLayer('forests-join');
        if (typeof mapLayer !== 'undefined') {
            this.state.map.removeLayer("forests-join");
            this.state.map.removeSource("forests");

            this.state.map.addSource("forests", {
                type: "vector",
                url: "mapbox://pine-beetle-prediction.1be58pyi"
            });
        }

        if (this.state.dataControllerState.predictiveModelOutputArray.length > 0) {
            var expression = ["match", ["upcase", ["get", "forest"]]];
            var forestsAdded = []

            // calculate color for each state based on clerids
            this.state.dataControllerState.predictiveModelOutputArray.forEach(function(row) {
                let color;

                if (row.outputs["prob53spots"] <= 0.010 ) {
                    color = this.state.colors[0]
                }
                else if (row.outputs["prob53spots"] > 0.010 && row.outputs["prob53spots"] <= 0.017) {
                    color = this.state.colors[1]
                }
                else if (row.outputs["prob53spots"] > 0.017 && row.outputs["prob53spots"] <= 0.028) {
                    color = this.state.colors[2]
                }
                else if (row.outputs["prob53spots"] > 0.028 && row.outputs["prob53spots"] <= 0.046) {
                    color = this.state.colors[3]
                }
                else if (row.outputs["prob53spots"] > 0.046 && row.outputs["prob53spots"] <= 0.077) {
                    color = this.state.colors[4]
                } 
                else if (row.outputs["prob53spots"] > 0.077 && row.outputs["prob53spots"] <= 0.129) {
                    color = this.state.colors[5]
                }
                else if (row.outputs["prob53spots"] > 0.129 && row.outputs["prob53spots"] <= 0.215) {
                    color = this.state.colors[6]
                }
                else if (row.outputs["prob53spots"] > 0.215 && row.outputs["prob53spots"] <= 0.359) {
                    color = this.state.colors[7]
                }
                else if (row.outputs["prob53spots"] > 0.359 && row.outputs["prob53spots"] <= 0.599) {
                    color = this.state.colors[8]
                }
                else if (row.outputs["prob53spots"] > 0.599) {
                    color = this.state.colors[9]
                } 

                if (!forestsAdded.includes(row.inputs["forest"])) {
                    expression.push(row.inputs["forest"], color);
                    forestsAdded.push(row.inputs["forest"]);
                }

            }.bind(this));

            // last value is the default, used where there is no data
            expression.push("rgba(0,0,0,0)");

            // add layer from the vector tile source with data-driven style
            this.state.map.addLayer({
                "id": "forests-join",
                "type": "fill",
                "source": "forests",
                "source-layer": "US_Counties_updated",
                "paint": {
                    "fill-color": expression
                }
            }, 'national-park');

            if (this.state.dataControllerState.userFilters.stateAbbreviation !== null) {
                var center = this.state.dataControllerState.stateToZoomLevel[this.state.dataControllerState.userFilters.stateAbbreviation][0];
                var zoom = this.state.dataControllerState.stateToZoomLevel[this.state.dataControllerState.userFilters.stateAbbreviation][1];

                this.state.map.flyTo({
                    center: center,
                    zoom: zoom
                });
            }
            else {
                mapLayer = this.state.map.getLayer('forests-join');
                if (typeof mapLayer !== 'undefined') {
                    this.state.map.removeLayer("forests-join");
                }

                this.state.map.flyTo({
                    center: [-84.3880,33.7490],
                    zoom: 4.8
                });
            }
        }
        else {
            mapLayer = this.state.map.getLayer('forests-join');
            if (typeof mapLayer !== 'undefined') {
                this.state.map.removeLayer("forests-join");
            }

            this.state.map.flyTo({
                center: [-84.3880,33.7490],
                zoom: 4.8
            });
        }
    }
}

class DownloadControl {
    onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'download-button mapboxgl-ctrl';
        this.container.innerHTML =  '<p>Download</p>';
        return this.container;
    }
    
    onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
} 

export default PredictiveMap

