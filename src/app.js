import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  getCountyPredictions,
  getCountyTrapping,
  getRangerDistrictPredictions,
  getRangerDistrictTrapping,
  setDataMode,
} from './state/actions';

import {
  About,
  Admin,
  HistoricalData,
  HowItWorks,
  Landing,
  PlayWithModel,
  Prediction,
} from './screens';

import {
  Header,
  Footer,
} from './components';

import {
  DATA_MODES,
  getServerUrl,
  ROUTES,
} from './constants';

const FallBack = () => {
  return <div>URL not found</div>;
};

const App = (props) => {
  const {
    countyPredictions,
    countyTrapping,
  } = props;

  useEffect(() => {
    global.API_URL = getServerUrl();

    // fetch initial data
    props.getCountyTrapping();
    props.getRangerDistrictTrapping();
    props.getCountyPredictions();
    props.getRangerDistrictPredictions();
  }, []);

  // set all trapping/prediction all fields to county once we get them
  useEffect(() => {
    props.setDataMode(DATA_MODES.COUNTY); // note that this can be driven by a local storage cookie in the future
  }, [countyPredictions, countyTrapping]);

  return (
    <Router>
      <div>
        <Header />
        <div className="content">
          <Switch>
            <Route exact path={ROUTES.HOME} component={Landing} />
            <Route path={ROUTES.ABOUT} component={About} />
            <Route path={ROUTES.ADMIN} component={Admin} />
            <Route path={ROUTES.HISTORICAL_DATA} component={HistoricalData} />
            <Route path={ROUTES.HOW_IT_WORKS} component={HowItWorks} />
            <Route path={ROUTES.PLAY_WITH_MODEL} component={PlayWithModel} />
            <Route path={ROUTES.PREDICTIONS} component={Prediction} />
            <Route component={FallBack} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

const mapStateToProps = (state) => {
  const {
    trappings: {
      county: countyTrapping,
    },
    predictions: {
      county: countyPredictions,
    },
  } = state;

  return {
    countyTrapping,
    countyPredictions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCountyPredictions: (filters) => {
      dispatch(getCountyPredictions(filters));
    },
    getCountyTrapping: (filters) => {
      dispatch(getCountyTrapping(filters));
    },
    getRangerDistrictPredictions: (filters) => {
      dispatch(getRangerDistrictPredictions(filters));
    },
    getRangerDistrictTrapping: (filters) => {
      dispatch(getRangerDistrictTrapping(filters));
    },
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
