import React, { useEffect } from 'react';
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
  useLocation,
} from 'react-router-dom';

import {
  About,
  Admin,
  Blog,
  Contact,
  Data,
  DataTable,
  DownloadData,
  Explainers,
  Home,
  Methodology,
  PlayWithModelScreen,
  Resources,
  ResultsComparison,
  SingleBlogPost,
  TimeSeries,
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

const ConditionalFooter = () => {
  const location = useLocation();
  const isHomePage = location.pathname === ROUTES.HOME;

  if (isHomePage) {
    return null;
  }

  return <Footer />;
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

  // Mobile blockade disabled - app now works on mobile devices

  return (
    <Router>
      <Header />
      <div className="content">
        <Switch>
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.ABOUT} component={About} />
          <Route path={ROUTES.ADMIN} component={Admin} />
          <Route path={`${ROUTES.BLOG}/:id`} component={SingleBlogPost} />
          <Route path={ROUTES.BLOG} component={Blog} />
          <Route path={ROUTES.CONTACT} component={Contact} />
          <Route path={ROUTES.DATA} component={Data} />
          <Route path={ROUTES.DATA_TABLE} component={DataTable} />
          <Route path={ROUTES.DOWNLOAD_DATA} component={DownloadData} />
          <Route path={ROUTES.EXPLAINERS} component={Explainers} />
          <Route path={ROUTES.TIME_SERIES} component={TimeSeries} />
          <Route path={ROUTES.METHODOLOGY} component={Methodology} />
          <Route path={ROUTES.PLAY_WITH_MODEL} component={PlayWithModelScreen} />
          <Route path={ROUTES.RESOURCES} component={Resources} />
          {/* Redirect old prediction route to home page (new prediction page) */}
          <Route path={ROUTES.PREDICTIONS}>
            <Redirect to={ROUTES.HOME} />
          </Route>
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
      <ConditionalFooter />
    </Router>
  );
};

export default App;
