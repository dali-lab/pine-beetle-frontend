import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  getCountyPredictions,
  getCountyTrapping,
  getRangerDistrictPredictions,
  getRangerDistrictTrapping,
  setDataMode,
  getUserFromStorage,
} from './state/actions';

import {
  Admin,
  TrappingData,
  Home,
  PlayWithModel,
  Prediction,
} from './screens';

import {
  Header,
  Footer,
  ScrollToTop,
} from './components';

import {
  DATA_MODES,
  getServerUrl,
  ROUTES,
} from './constants';

import {
  getAuthTokenFromStorage,
  getUserIdFromStorage,
} from './utils';

const FallBack = () => {
  return <div>URL not found</div>;
};

const App = (props) => {
  const {
    countyPredictions,
    countyTrapping,
    loginUserFromStorage,
  } = props;

  useEffect(() => {
    global.API_URL = getServerUrl();

    // fetch initial data
    props.getCountyTrapping();
    props.getRangerDistrictTrapping();
    props.getCountyPredictions();
    props.getRangerDistrictPredictions();

    // fetch user data if persist in browser
    if (getAuthTokenFromStorage() && getUserIdFromStorage()) {
      loginUserFromStorage();
    }
  }, []);

  // set all trapping/prediction all fields to county once we get them
  useEffect(() => {
    props.setDataMode(DATA_MODES.COUNTY); // note that this can be driven by a local storage cookie in the future
  }, [countyPredictions, countyTrapping]);

  return (
    <Router>
      <ScrollToTop>
        <div>
          <Header />
          <div className="content">
            <Switch>
              <Route exact path={ROUTES.HOME} component={Home} />
              <Route path={ROUTES.ADMIN} component={Admin} />
              <Route path={ROUTES.TRAPPING_DATA} component={TrappingData} />
              <Route path={ROUTES.PLAY_WITH_MODEL} component={PlayWithModel} />
              <Route path={ROUTES.PREDICTIONS} component={Prediction} />
              <Route component={FallBack} />
            </Switch>
          </div>
          <Footer />
        </div>
      </ScrollToTop>
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
    loginUserFromStorage: () => {
      dispatch(getUserFromStorage());
    },
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
