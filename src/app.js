import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

// import {
//   fetchRemoteAppConfig,
//   getAllFridges,
//   getAllProducts,
//   getAllProductTags,
//   getAllPromotions,
//   getUserData,
// } from './state/actions';

import {
  About,
  Admin,
  HistoricalData,
  HowItWorks,
  Landing,
  Prediction,
} from './screens';

import {
  Header,
  Footer,
} from './components';

import {
  getServerUrl,
} from './constants';

const FallBack = () => {
  return <div>URL not found</div>;
};

const App = () => {
  useEffect(() => {
    global.API_URL = getServerUrl();
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <div className="content">
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/about" component={About} />
            <Route path="/admin" component={Admin} />
            <Route path="/historical-data" component={HistoricalData} />
            <Route path="/how-it-works" component={HowItWorks} />
            <Route path="/predictions" component={Prediction} />
            <Route component={FallBack} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
