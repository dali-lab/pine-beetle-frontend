import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import {
  About,
  Admin,
  TrappingData,
  Home,
  PlayWithModel,
  Prediction,
} from '../screens';

import {
  Header,
  Footer,
  MobileOverlay,
  ScrollToTop,
} from '../components';

import {
  CHART_MODES,
  DATA_MODES,
  getAutomationServerUrl,
  getServerUrl,
  MIN_WIDTH_THRESHOLD,
  ROUTES,
} from '../constants';

import {
  getAuthTokenFromStorage,
  getDataModeFromStorage,
  getUserIdFromStorage,
} from '../utils';

const FallBack = () => {
  return <div>URL not found</div>;
};

global.API_URL = getServerUrl();
global.AUTOMATION_API_URL = getAutomationServerUrl();

const App = (props) => {
  const {
    loginUserFromStorage,
    predictionYear,
    startYear,
    chartMode,
    setDataMode,
    setChartMode,
    getAggregateYearData,
    getAggregateStateData,
    getAggregateLocationData,
    getPredictions,
    getAvailableStates,
  } = props;

  const [isMobile, setIsMobile] = useState(window.innerWidth < MIN_WIDTH_THRESHOLD);

  useEffect(() => {
    const resizeListener = (e) => setIsMobile(e.target.innerWidth < MIN_WIDTH_THRESHOLD);
    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useEffect(() => {
    global.API_URL = getServerUrl();
    global.AUTOMATION_API_URL = getAutomationServerUrl();

    // fetch user data if persist in browser
    if (getAuthTokenFromStorage() && getUserIdFromStorage()) {
      loginUserFromStorage();
    }

    // set data/chart mode if persist in browser
    setDataMode(getDataModeFromStorage() || DATA_MODES.COUNTY);
    setChartMode(CHART_MODES.MAP);

    // fetch initial data
    getAggregateYearData();
    getAggregateStateData();
    getAggregateLocationData();
  }, [
    getAggregateLocationData,
    getAggregateStateData,
    getAggregateYearData,
    loginUserFromStorage,
    setChartMode,
    setDataMode,
  ]);

  useEffect(() => {
    if (chartMode === CHART_MODES.GRAPH) {
      getPredictions(startYear, predictionYear);
      getAvailableStates({ predictionYear });
    } else {
      getPredictions(predictionYear, predictionYear);
      getAvailableStates({ predictionYear });
    }
  }, [
    startYear,
    predictionYear,
    chartMode,
    getPredictions,
    getAvailableStates,
  ]);

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

export default App;
