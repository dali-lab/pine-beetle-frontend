import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DataController from './DataController.js'
import ScrollToTop from './ScrollToTop.js'
import Header from './header-footer/Header.js'
import Footer from './header-footer/Footer.js'
import Home from './Home.js'
import About from './about-page/About.js';
import ViewHistoricalData from './historical-data-page/ViewHistoricalData.js';
import ViewPredictions from './predictive-model-page/ViewPredictions.js';
import MobileLandingPage from './MobileLandingPage.js';
import '../styles/App.css';

class App extends Component {
    constructor(props) {
        super(props)
        // define urls
        this.localURL = "http://localhost:9090/v1/";
        this.deployedURL = "https://pine-beetle-prediction.herokuapp.com/v1/";

        // hold onto state of dataController
        this.state = {
            dataControllerState: null,
            minimumAcceptableBrowserWidth: 500,
            acceptableBrowserWidth: window.innerWidth > 500 ? true : false
        };

        // create reference
        this.dataController = React.createRef();

        // uncomment this and pass to DataController as a prop for local json data
        // data={require('../data/historical_data.json')}
    }
    render() {
        // as long as window is wide enough, load the site
        if (this.state.acceptableBrowserWidth === true) {
            return(
                <div>
                    <DataController url={this.deployedURL} parent={this} forceReRender={this.forceReRender} ref={this.dataController}/>
                    <Router>
                      <div>
                        <Header />
                        <div className="content">
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route path="/about" component={About} />
                                <Route path='/viewdata'render={(props) => <ViewHistoricalData {...props} dataController={this.dataController} dataControllerState={this.state.dataControllerState}/>}/>
                                <Route path='/predictions'render={(props) => <ViewPredictions {...props} dataController={this.dataController} dataControllerState={this.state.dataControllerState}/>}/>
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
                <MobileLandingPage />
            );
        }
    }

    // force re-render immediately after dataController was created
    componentDidMount() {
        this.render();

        // set event listener for browser resize
        this.checkAcceptableBrowserWidth();
        window.addEventListener("resize", this.checkAcceptableBrowserWidth.bind(this));
    }

    // remove event listener for browser resize
    componentWillUnmount() {
        window.removeEventListener("resize", this.checkAcceptableBrowserWidth.bind(this));
    }

    // determine if the browser width is wide enough
    checkAcceptableBrowserWidth() {
        if (window.innerWidth >= this.state.minimumAcceptableBrowserWidth) {
            this.setState({
                acceptableBrowserWidth: true
            });
        }
        else {
            this.setState({
                acceptableBrowserWidth: false
            });
        }
    }
}

export default App;
