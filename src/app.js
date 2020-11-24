import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  getCountyPredictions,
  getCountyTrapping,
  getRangerDistrictPredictions,
  getRangerDistrictTrapping,
  getUserFromStorage,
  setChartMode,
  setCounty,
  setDataMode,
  setRangerDistrict,
  setState,
  setYear,
  setYearRange,
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
  CHART_MODES,
  DATA_MODES,
  getServerUrl,
  ROUTES,
} from './constants';

import {
  getAuthTokenFromStorage,
  getChartModeFromStorage,
  getCountyFromStorage,
  getDataModeFromStorage,
  getEndYearFromStorage,
  getRangerDistrictFromStorage,
  getStartYearFromStorage,
  getStateFromStorage,
  getUserIdFromStorage,
  getYearFromStorage,
} from './utils';

const FallBack = () => {
  return <div>URL not found</div>;
};

const App = (props) => {
  const {
    county,
    countyPredictions,
    countyTrapping,
    endYear,
    loginUserFromStorage,
    rangerDistrict,
    selectedState,
    startYear,
    year,
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

    // set selections if persist in browser
    props.setChartMode(getChartModeFromStorage() || CHART_MODES.GRAPH);
    props.setState(getStateFromStorage() || selectedState);
    props.setCounty(getCountyFromStorage() || county);
    props.setRangerDistrict(getRangerDistrictFromStorage() || rangerDistrict);
    props.setYear(parseInt(getYearFromStorage(), 10) || year);
    props.setYearRange(parseInt(getStartYearFromStorage(), 10) || startYear, parseInt(getEndYearFromStorage(), 10) || endYear);
  }, []);

  // set all trapping/prediction all fields to county once we get them
  useEffect(() => {
    props.setDataMode(getDataModeFromStorage() || DATA_MODES.COUNTY);
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
    selections: {
      state: selectedState,
      county,
      rangerDistrict,
      year,
      yearRange: {
        startYear,
        endYear,
      },
    },
  } = state;

  return {
    county,
    countyPredictions,
    countyTrapping,
    endYear,
    rangerDistrict,
    selectedState,
    startYear,
    year,
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
    setState: (state) => {
      dispatch(setState(state));
    },
    setCounty: (county) => {
      dispatch(setCounty(county));
    },
    setRangerDistrict: (rangerDistrict) => {
      dispatch(setRangerDistrict(rangerDistrict));
    },
    setYear: (year) => {
      dispatch(setYear(year));
    },
    setYearRange: (startYear, endYear) => {
      dispatch(setYearRange(startYear, endYear));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
