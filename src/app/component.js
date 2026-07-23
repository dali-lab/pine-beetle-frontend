import React, { useEffect, useRef } from 'react';
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
  Maps,
  MapsTreeDensity,
  MapsFragmentation,
  MapsMinWinterTemp,
  Methodology,
  PlayWithModelScreen,
  Resources,
  ObservedOutcomes,
  SingleBlogPost,
  TimeSeries,
} from '../screens';

import {
  Footer,
  Header,
} from '../components';

import {
  DATA_MODES,
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
    getAvailableYears,
    getSparseData,
    getAllBlogPosts,
    getObservedOutcomesData,
    getScatterChartData,
  } = props;

  const initialLoadDone = useRef(false);

  // Initial data fetch - only runs once on mount
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    global.API_URL = process.env.MAIN_BACKEND_URL;
    global.AUTOMATION_API_URL = process.env.AUTOMATION_BACKEND_URL;

    // fetch user data if persist in browser
    if (getAuthTokenFromStorage() && getUserIdFromStorage()) {
      loginUserFromStorage();
    }

    // set data mode if persist in browser (skip data fetch - pages will fetch their own data)
    setDataMode(getDataModeFromStorage() || DATA_MODES.COUNTY, { skipDataFetch: true });

    // Only fetch data needed for current page - other pages fetch their own data
    const { pathname } = window.location;
    const isHomePage = pathname === '/' || pathname === '/home';
    const isBlogPage = pathname.startsWith('/blog');
    const isResultsPage = pathname === '/observed-outcomes';

    // Home page needs predictions and sparse data for the map
    // Fetch years, predictions, and available states immediately
    if (isHomePage) {
      getAvailableYears();
      getPredictions(predictionYear);
      getAvailableStates({ predictionYear });
    }

    // Blog pages need blog posts
    if (isBlogPage) {
      getAllBlogPosts();
    }

    if (isResultsPage && predictionYear) {
      getObservedOutcomesData(predictionYear);
      getScatterChartData();
    }
  }, [
    getAggregateLocationData,
    getAggregateStateData,
    getAggregateYearData,
    getAllBlogPosts,
    getAvailableStates,
    getAvailableYears,
    getPredictions,
    getSparseData,
    getObservedOutcomesData,
    getScatterChartData,
    loginUserFromStorage,
    setChartMode,
    setDataMode,
    predictionYear,
  ]);

  // Re-fetch predictions when predictionYear changes (but not on mount)
  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    getPredictions(predictionYear);
    getAvailableStates({ predictionYear });
  }, [
    predictionYear,
    getPredictions,
    getAvailableStates,
  ]);

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
          <Route path={ROUTES.OBSERVED_OUTCOMES} component={ObservedOutcomes} />
          <Route exact path={ROUTES.MAPS} component={Maps} />
          <Route path={ROUTES.MAPS_TREE_DENSITY} component={MapsTreeDensity} />
          <Route path={ROUTES.MAPS_FRAGMENTATION} component={MapsFragmentation} />
          <Route path={ROUTES.MAPS_MIN_WINTER_TEMP} component={MapsMinWinterTemp} />
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
