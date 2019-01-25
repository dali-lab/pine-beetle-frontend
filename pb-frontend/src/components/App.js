import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DataController from './DataController.js'
import ScrollToTop from './ScrollToTop.js'
import Header from './header-footer/Header.js'
import Footer from './header-footer/Footer.js'
import Home from './Home.js'
import About from './about/About.js';
import ViewHistoricalData from './historical-data-page/ViewHistoricalData.js';
import ViewPredictions from './predictive-model-page/ViewPredictions.js';
import ArcGISOnline from './arcgis-online/ArcGISOnline.js';
import '../styles/App.css';

class App extends Component {
    constructor(props) {
        super(props)
        // define urls
        this.local = '../data/historical_data.json'; // not sure we will need this anymore
        this.localURL = "http://localhost:9090/v1/getHistoricals";
        this.deployedURL = "https://pine-beetle-prediction.herokuapp.com/v1/getHistoricals";

        // hold onto state of dataController
        this.state = {
            dataControllerState: null
        };

        // create reference
        this.dataController = React.createRef();
    }
    render() {
        // as long as window is wide enough, load the site
        if (window.innerWidth >= 500) {
            return(
                <div>
                    <DataController data={require('../data/historical_data.json')} parent={this} ref={this.dataController}/>
                    <Router>
                      <div>
                        <Header />
                        <div className="content">
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route path="/about" component={About} />
                                <Route path='/viewdata'render={(props) => <ViewHistoricalData {...props} dataController={this.dataController} dataControllerState={this.state.dataControllerState}/>}/>
                                <Route path='/predictions'render={(props) => <ViewPredictions {...props} dataController={this.dataController} dataControllerState={this.state.dataControllerState}/>}/>
                                <Route path="/arcgis-online" component={ArcGISOnline} />
                                <Route path="*" component={Home} />
                            </Switch>
                        </div>
                        <ScrollToTop />
                        <Footer />
                      </div>
                    </Router>
                </div>
            );
        }

        // if window not wide enough, load mobile landing page
        else {
            return(
                <div id="mobile-landing-page">
                    <h2>Uh oh!</h2>
                    <p>This website is not compatible on mobile.</p>
                    <p>Please navigate to a desktop to proceed.</p>
                </div>
            );
        }
    }

    // force re-render immediately after dataController was created
    componentDidMount() {
        this.render()
    }
}

export default App;
