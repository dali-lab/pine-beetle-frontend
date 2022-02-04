import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  getAggregateYearData,
  getAggregateStateData,
  getAggregateLocationData,
  getPredictions,
  getUserFromStorage,
  setChartMode,
  setDataMode,
} from './state/actions';

import {
  About,
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
  getAutomationServerUrl,
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
    loginUserFromStorage,
    yearData,
  } = props;

  const [isMobile, setIsMobile] = useState(window.innerWidth < MIN_WIDTH_THRESHOLD);

  useEffect(() => {
    global.API_URL = getServerUrl();
    global.AUTOMATION_API_URL = getAutomationServerUrl();

    // fetch user data if persist in browser
    if (getAuthTokenFromStorage() && getUserIdFromStorage()) {
      loginUserFromStorage();
    }

    // set data/chart mode if persist in browser
    props.setDataMode(getDataModeFromStorage() || DATA_MODES.COUNTY);
    props.setChartMode(getChartModeFromStorage() || CHART_MODES.GRAPH);

    // fetch initial data
    props.getAggregateYearData();
    props.getAggregateStateData();
    props.getAggregateLocationData();

    const resizeListener = e => setIsMobile(e.target.innerWidth < MIN_WIDTH_THRESHOLD);
    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useEffect(() => {
    props.getPredictions(Math.max(...yearData.map(({ year }) => year)));
  }, [yearData]);

  if (isMobile) return <MobileOverlay />;

  return (
    <Router>
      <ScrollToTop>
        <div>
          <Header />
          <div className="content">
            <Switch>
              <Route exact path={ROUTES.HOME} component={Home} />
              <Route path={ROUTES.ABOUT} component={About} />
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
    data: {
      yearData,
    },
  } = state;

  return {
    yearData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAggregateYearData: () => {
      dispatch(getAggregateYearData());
    },
    getAggregateStateData: () => {
      dispatch(getAggregateStateData());
    },
    getAggregateLocationData: () => {
      dispatch(getAggregateLocationData());
    },
    getPredictions: (year) => {
      dispatch(getPredictions(year));
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
