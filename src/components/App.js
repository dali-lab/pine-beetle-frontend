import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HashRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import DataController from './DataController.js';
import ScrollToTop from './ScrollToTop.js';
import Header from './header-footer/Header.js';
import Footer from './header-footer/Footer.js';
import Home from './Home.js';
import About from './about-page/About.js';
import ViewHistoricalData from './historical-data-page/ViewHistoricalData.js';
import ViewPredictions from './predictive-model-page/ViewPredictions.js';
import MobileLandingPage from './MobileLandingPage.js';
import LoadingContainer from './LoadingContainer.js';
import UploadLandingPage from './UploadLandingPage.js';
import UploadDataFromSurvey123 from './UploadDataFromSurvey123.js';
import '../styles/App.css';

// google analytics
ReactGA.initialize('UA-133847731-1');
ReactGA.pageview(window.location.pathname + window.location.search);

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
            acceptableBrowserWidth: window.innerWidth > 500 ? true : false,
            passwordProtectedPageRoute: '/' + Math.random().toString(36).substring(2),
            lockedOut: this.getCookie("upload-locked-out") === "true" ? true : false
        };

        // create reference
        this.dataController = React.createRef();
        this.setLockout = this.setLockout.bind(this);

        // uncomment this and pass to DataController as a prop for local json data
        // data={require('../data/historical_data.json')}
    }
    render() {
        // as long as window is wide enough, load the site
        if (this.state.acceptableBrowserWidth === true) {
            return(
                <div>
                    <DataController url={this.localURL} parent={this} forceReRender={this.forceReRender} ref={this.dataController}/>
                    <HashRouter hashType="noslash">
                      <div>
                        <Header />
                        <div className="content">
                            <Switch>
                                <Route exact path='/' component={Home} />
                                <Route path='/historical-data'render={(props) => <ViewHistoricalData {...props} dataController={this.dataController} dataControllerState={this.state.dataControllerState}/>}/>
                                <Route path='/predictions'render={(props) => <ViewPredictions {...props} dataController={this.dataController} dataControllerState={this.state.dataControllerState}/>}/>
                                <Route path="/about" component={About} />
                                <Route path="/loading" component={LoadingContainer} />
                                <Route path='/uploadSurvey123Data' render={(props) => <UploadLandingPage {...props} passwordProtectedPageRoute={this.state.passwordProtectedPageRoute} setLockout={this.setLockout} lockedOut={this.state.lockedOut} />}/>
                                <Route path={this.state.passwordProtectedPageRoute} render={(props) => <UploadDataFromSurvey123 {...props} dataController={this.dataController} dataControllerState={this.state.dataControllerState} url={this.localURL} lockedOut={this.state.lockedOut} />}/>
                                <Route path="*" component={Home} />
                            </Switch>
                        </div>
                        <ScrollToTop />
                        <Footer />
                      </div>
                    </HashRouter>
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

    setLockout(value) {
        this.setState({
            lockedOut: value
        })
    }

    // source: https://www.w3schools.com/js/js_cookies.asp
    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }
}

export default App;
