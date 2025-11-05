import React, { useEffect, useState } from 'react';
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import {
  About,
  Admin,
  Blog,
  Home,
  Prediction,
  Resources,
  ResultsComparison,
  SingleBlogPost,
  TrappingData,
} from '../screens';

import {
  Footer,
  Header,
  MobileOverlay,
  ScrollToTop,
} from '../components';

import {
  DATA_MODES,
  MIN_WIDTH_THRESHOLD,
  RESOURCE_REMOTE_URLS,
  RESOURCE_ROUTES,
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

global.API_URL = process.env.MAIN_BACKEND_URL;
global.AUTOMATION_API_URL = process.env.AUTOMATION_BACKEND_URL;

const App = (props) => {
  const {
    loginUserFromStorage,
    predictionYear,
    setDataMode,
    setChartMode,
    getAggregateYearData,
    getAggregateStateData,
    getAggregateLocationData,
    getPredictions,
    getAvailableStates,
    getSparseData,
    getAllBlogPosts,
    getResultsComparisonData,
    getScatterChartData,
  } = props;

  const [isMobile, setIsMobile] = useState(window.innerWidth < MIN_WIDTH_THRESHOLD);

  useEffect(() => {
    const resizeListener = (e) => setIsMobile(e.target.innerWidth < MIN_WIDTH_THRESHOLD);
    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useEffect(() => {
    global.API_URL = process.env.MAIN_BACKEND_URL;
    global.AUTOMATION_API_URL = process.env.AUTOMATION_BACKEND_URL;

    // fetch user data if persist in browser
    if (getAuthTokenFromStorage() && getUserIdFromStorage()) {
      loginUserFromStorage();
    }

    // set data mode if persist in browser
    setDataMode(getDataModeFromStorage() || DATA_MODES.COUNTY);

    // fetch initial data
    // TODO rework redux to only have stuff fetched here
    getAggregateYearData();
    getAggregateStateData();
    getAggregateLocationData();
    getAllBlogPosts();
    getSparseData();
    getPredictions();
    getResultsComparisonData(predictionYear);
    getScatterChartData();
  }, [
    getAggregateLocationData,
    getAggregateStateData,
    getAggregateYearData,
    getAllBlogPosts,
    getPredictions,
    getSparseData,
    getResultsComparisonData,
    getScatterChartData,
    loginUserFromStorage,
    setChartMode,
    setDataMode,
    predictionYear,
  ]);

  // TODO rework redux to only have stuff fetched here
  useEffect(() => {
    getPredictions(predictionYear, predictionYear);
    getAvailableStates({ predictionYear });
  }, [
    predictionYear,
    getPredictions,
    getAvailableStates,
  ]);

  if (isMobile) return <MobileOverlay />;

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <div className="content">
        <Switch>
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.ABOUT} component={About} />
          <Route path={ROUTES.ADMIN} component={Admin} />
          <Route path={`${ROUTES.BLOG}/:id`} component={SingleBlogPost} />
          <Route path={ROUTES.BLOG} component={Blog} />
          <Route path={ROUTES.RESOURCES} component={Resources} />
          <Route path={ROUTES.TRAPPING_DATA} component={TrappingData} />
          <Route path={ROUTES.PREDICTIONS} component={Prediction} />
          <Route path={ROUTES.RESULTS_COMPARISON} component={ResultsComparison} />
          {Object.entries(RESOURCE_ROUTES).map(([TYPE, ROUTE]) => (
            <Route
              key={ROUTE}
              path={ROUTE}
              render={() => {
                window.location.replace(RESOURCE_REMOTE_URLS[TYPE]);
                return (<Redirect to={{ pathname: ROUTES.RESOURCES }} />);
              }}
            />
          ))}
          <Route component={FallBack} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
