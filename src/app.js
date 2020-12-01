import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  getCountyPredictions,
  getCountyTrapping,
  getRangerDistrictPredictions,
  getRangerDistrictTrapping,
  getUserFromStorage,
  setChartMode,
  setDataMode,
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
  MobileOverlay,
  ScrollToTop,
} from './components';

import {
  CHART_MODES,
  DATA_MODES,
  getServerUrl,
  MIN_WIDTH_THRESHOLD,
  ROUTES,
} from './constants';

import {
  getAuthTokenFromStorage,
  getChartModeFromStorage,
  getDataModeFromStorage,
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < MIN_WIDTH_THRESHOLD);

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

    // set chart mode if persist in browser
    props.setChartMode(getChartModeFromStorage() || CHART_MODES.GRAPH);

    const resizeListener = e => setIsMobile(e.target.innerWidth < MIN_WIDTH_THRESHOLD);
    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  // set all trapping/prediction all fields to county once we get them
  useEffect(() => {
    props.setDataMode(getDataModeFromStorage() || DATA_MODES.COUNTY);
  }, [countyPredictions, countyTrapping]);

  if (isMobile) return <MobileOverlay />;

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
    countyPredictions,
    countyTrapping,
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
    setChartMode: (mode) => {
      dispatch(setChartMode(mode));
    },
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
