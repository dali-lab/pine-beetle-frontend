import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ScrollToTop from './ScrollToTop.js'
import Header from './Header.js'
import Footer from './Footer.js'
import Home from './Home.js'
import About from './About.js';
import ViewData from './ViewData.js';
import '../styles/App.css';

class App extends Component {
    render() {
        return(
            <Router>
              <div>
                <Header />
                <div className="main-content">
                    <div className="container">
                        <Route exact path="/" component={Home} />
                        <Route path="/about" component={About} />
                        <Route path="/viewdata" component={ViewData} />
                    </div>
                </div>
                <ScrollToTop />
                <Footer />
              </div>
            </Router>
        );
    }
}

export default App;
