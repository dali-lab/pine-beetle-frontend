import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

// scroll to the top of the page when we navigate to a new route
// source: https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
class ScrollToTop extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }
    render() {
      return null;
    }
}

export default withRouter(ScrollToTop)
