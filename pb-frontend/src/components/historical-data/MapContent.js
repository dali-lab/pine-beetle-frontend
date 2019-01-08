import React, { Component } from 'react';
import { loadModules } from 'react-arcgis';
import '../../styles/historical-data/MapContent.css';

class MapContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            graphics: [],
            layer: null
        }

        this.createGraphics = this.createGraphics.bind(this);
        this.createLayer = this.createLayer.bind(this);
    }

    render() {
        return null;
    }

    // on mount initialize map components then store data
    componentDidMount() {
        this.initializeMapVariables();
        this.updateStateFromProps(this.props);
    }

    // if receiving new data, update the state
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
        // remove the map
        this.props.view.map.remove(this.state.layer);
        // clear the graphics and layer, then remake
        this.setState({
            graphics: [],
            layer: null
        }, () => {
            this.createGraphics();
            this.createLayer();
        });
    }

    // store new data from props
    updateStateFromProps(props) {
        this.setState({
            data: props.data
        });
    }

    // before mounting create the point objects and construct a layer
    componentWillMount() {
        this.createGraphics();
        this.createLayer();
    }

    // build necessary variables for the map
    initializeMapVariables() {
        this.buildFields();
        this.buildPTemplate();
        this.buildRenderer();
    }

    // define expected field attributes associated with points on the map
    buildFields() {
        this.fields = [
          {
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid"
          }, {
            name: "name",
            alias: "name",
            type: "string"
          }, {
            name: "classification",
            alias: "classification",
            type: "string"
          }, {
            name: "cleridsPerTwoWeeks",
            alias: "cleridsPerTwoWeek",
            type: "integer"
          }, {
            name: "forest",
            alias: "forest",
            type: "string"
          }, {
            name: "nf",
            alias: "nf",
            type: "string"
          }, {
            name: "percentSpb",
            alias: "percentSpb",
            type: "integer"
          }, {
            name: "spbPerTwoWeeks",
            alias: "spbPerTwoWeeks",
            type: "integer"
          }, {
            name: "spots",
            alias: "spots",
            type: "integer"
          }, {
            name: "spotsPerHundredKm",
            alias: "spotsPerHundredKm",
            type: "integer"
          }, {
            name: "state",
            alias: "state",
            type: "string"
          }, {
            name: "year",
            alias: "year",
            type: "integer"
        }];
    }

    // define template for how the pop-up menu should appear for each point
    buildPTemplate() {
        this.pTemplate = {
            title: "{name}",
            content: [{
              type: "fields",
              fieldInfos: [{
                fieldName: "name",
                label: "Location",
                visible: true
              }, {
                fieldName: "year",
                label: "Year",
                visible: true
              }, {
                fieldName: "percentSpb",
                label: "Percent SPB",
                visible: true
              }, {
                fieldName: "cleridsPerTwoWeeks",
                label: "Clerids Per Two Weeks",
                visible: true
              }, {
                fieldName: "spbPerTwoWeeks",
                label: "SPB Per Two Weeks",
                visible: true
              }, {
                fieldName: "spots",
                label: "Spots",
                visible: true
              }, {
                fieldName: "spotsPerHundredKm",
                label: "Spots Per Hundred KM",
                visible: true
              }]
            }]
        };
    }

    // define how each point should appear
    buildRenderer() {
        this.renderer = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [233,196,106],
                size: "13px",
                outline: {
                    color: [36,66,79],
                    width: 0.5,
                    style: "solid"
                }
            }
        }
    }

    // create point objects that will occupy the layer
    createGraphics() {
        loadModules(['esri/geometry/Point']).then(([ Point ]) => {
            var graphicsAdded = [];

            // iterate through current data and add points to map
            for (var i in this.state.data) {
                // first check to make sure we have a place to put the point
                if (this.state.data[i].latitude != null && this.state.data[i].longitude != null) {
                    // create Point object - just location on the map to store point
                    var point = new Point({
                        longitude: this.state.data[i].longitude,
                        latitude: this.state.data[i].latitude
                    });

                    // clone the JSON object associated with this point and pass it as an attribute object to the Graphic object
                    // this is basically just associated data that is accessible in the menu that appears when a user clicks on a dot
                    var attributes = {
                        ObjectID: i,
                        name: "",
                        classification: this.state.data[i].classification,
                        cleridsPerTwoWeeks: this.state.data[i].cleridsPerTwoWeeks,
                        forest: this.state.data[i].forest,
                        nf: this.state.data[i].nf,
                        percentSpb: this.state.data[i].percentSpb,
                        spbPerTwoWeeks: this.state.data[i].spbPerTwoWeeks,
                        spots: this.state.data[i].spots,
                        spotsPerHundredKm: this.state.data[i].spotsPerHundredKm,
                        state: this.state.data[i].state,
                        year: this.state.data[i].year
                    }

                    // update name attribute based on if we have national forest, local, etc.
                    if (this.state.data[i].nf !== null && this.state.data[i].nf !== "" && this.state.data[i].nf !== undefined) {
                        attributes.name = this.state.data[i].nf + " NATL FOREST";
                    }
                    else if (this.state.data[i].forest !== null && this.state.data[i].forest !== "" && this.state.data[i].forest !== undefined) {
                        attributes.name = this.state.data[i].forest + " STATE FOREST";
                    }
                    else {
                        attributes.name = "STATE: " + this.state.data[i].state;
                    }

                    // put together
                    var object = {
                        geometry: point,
                        attributes: attributes
                    };

                    // store added object
                    graphicsAdded.push(object);
                    // this.props.view.graphics.add(pointGraphic);
                }
            }
            // set the state
            this.setState({
                graphics: graphicsAdded
            });
        }).catch((err) => console.error(err));
    }

    // construct the layer of points
    createLayer() {
        loadModules(['esri/layers/FeatureLayer']).then(([ FeatureLayer ]) => {
            var layer = new FeatureLayer({
                source: this.state.graphics, // autocast as an array of esri/Graphic
                geometryType: "point",
                // create an instance of esri/layers/support/Field for each field object
                fields: this.fields, // This is required when creating a layer from Graphics
                objectIdField: "ObjectID", // This must be defined when creating a layer from Graphics
                renderer: this.renderer, // set the visualization on the layer
                popupTemplate: this.pTemplate
            });

            this.props.view.map.add(layer);
            this.setState({
                layer: layer
            })
        }).catch((err) => console.error(err));
    }

    // remove layer if we are leaving
    componentWillUnmount() {
        this.props.view.map.remove(this.state.layer);
    }
}

export default MapContent
