import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollToTop from './ScrollToTop.js'
import Header from './header-footer/Header.js'
import Footer from './header-footer/Footer.js'
import Home from './Home.js'
import About from './about/About.js';
import ViewHistoricalData from './historical-data/ViewHistoricalData.js';
import ViewPredictions from './predictions/ViewPredictions.js';
import ArcGISOnline from './arcgis-online/ArcGISOnline.js';
import '../styles/App.css';

class App extends Component {
    constructor(props) {
        super(props)
        // define urls
        this.local = '../data/historical_data.json'; // not sure we will need this anymore
        this.localURL = "http://localhost:9090/v1/getHistoricals";
        this.deployedURL = "https://pine-beetle-prediction.herokuapp.com/v1/getHistoricals";
    }
    render() {
        return(
            <Router>
              <div>
                <Header />
                <div className="content">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/about" component={About} />
                        <Route path='/viewdata'render={(props) => <ViewHistoricalData {...props} data={require('../data/historical_data.json')} />}/>
                        <Route path="/predictions" component={ViewPredictions} />
                        <Route path="/arcgis-online" component={ArcGISOnline} />
                        <Route path="*" component={Home} />
                    </Switch>
                </div>
                <ScrollToTop />
                <Footer />
              </div>
            </Router>
        );
    }
}

export default App;
