# Project Pine Beetle Frontend

This is a React app for rendering the Pine Beetle Prediction client application.

## Project Overview

Project Pine Beetle is a web application that visualizes data on Southern Pine Beetle outbreaks in 16 states across the US. This tool uses a predictive model to predict future outbreaks and movements of Southern Pine Beetles.

On the frontend, this application provides valuable information for USFS researchers and state forest rangers to see information related to past outbreaks and predictions about future outbreaks. This application also provides information to the general public about threats facing their communities.

On the backend, this application aggregates data collected from USFS and state forest rangers on outbreaks and beetle counts, then uses those values to display historical data and future predictions. The predictive model used to generate predictions is written in R. All data is stored in a MongoDB database, allowing for easy pre and post-processing. Using an Express server, all calculations are made in JavaScript (outside of the predictive model and Mongo summarization/aggregation algorithms), and all data is stored in JSON format.

Project Pine Beetle is a collaboration between Professor Matt Ayres of Dartmouth College, Professor Carissa Aoki of Bates College, the United States Forest Service (USFS), and the Dartmouth Applied Learning and Innovation (DALI) Lab.

## Architecture

This web site uses [React.js](https://reactjs.org/) bundled with [webpack](https://webpack.js.org/). We use [react-redux](https://react-redux.js.org/) for persistent state management, and [react-router](https://reactrouter.com/) for internal routing.

We have two backend servers that are used for handling various functionality. Our [main backend server](https://github.com/dali-lab/pine-beetle-backend) is used to perform CRUD operations with the database. It also handles all authentication processes. The frontend sends most requests to this server. Our [automation server](https://github.com/dali-lab/pine-beetle-automation) is used for aggregating data from the USFS and restructuring it to our data format. Data comes from the USFS via several webhooks from [Survey123](https://survey123.arcgis.com/). See each of these repositories for more information.

## Setup

You must have [Node](https://nodejs.org) and [yarn](https://yarnpkg.com/) installed to run this project.

1. Clone the repository
2. `yarn install`
3. Add a `.env` file and paste in the necessary contents (see Handoff Document for this)
4. `yarn start` to run in the local development environment

## Repository Structure

```
src/
	assets/                     [all assets]
	components/                 [reusable components across several screens]
	constants/                  [all constants and mapping files]
	screens/                    [containers for each screen]
	services/                   [service files for sending server requests]
	state/                      [all redux interactions]
	utils/                      [utility functions]
.babelrc                        [babel setup]
.env.example                    [structure of .env file]
.eslintrc.json                  [eslint setup]
package.json                    [package]
webpack.config.js               [webpack setup]
```

### Componentization

This project uses file componentization as much as possible. Each screen or individual component is represented by a directory rather than a single file. Each component directory has the following files:

- `index.js` for connecting the component to the redux store and actions
- `component.js` for the React component
- `style.scss` for declaring styles
- `components/` directory for any subcomponents

The `component.js` file imports `style.scss` as well as any subcomponents from the `components/` directory. The `index.js` file imports `component.js`. It creates `mapStateToProps` and `mapDispatchToProps` functions and passes them to the `connect` function from `react-redux`, which returns a function that is immediately invoked on the component to pass all state variables and actions directly into the component props. This connected component is then exported in the `index.js` file, making it available for import from other files outside the directory.

### Data Flow

Our data flow uses a combination of service files and redux actions. Each request to one of our servers is encapsulated in a function that is stored in a file in the `services/` directory. We use `axios` for sending all server requests. Most service functions are then imported into action files in the `state/actions/` directory. Within an action, we call the service function to fetch data or perform an action, then dispatch actions with the resulting data. The reducers in the `state/reducers/` directory then are invoked when the actions are dispatched, and they update the relevant state.

The data in our app is split between trapping data and predictions data. The trapping data page visualizes the trapping data, and the predictions page likewise visualizes the predictions data. Each are broken into data on the county level and data on the ranger district level. Each type of data (trapping or predictions) is formatted the same on the county and ranger district level, but the county data contains a `county` field and the ranger district data contains a `rangerDistrict` field.

When the user switches their data mode (county or ranger district), our trapping and predictions reducers update their `data` field to be either the county level or ranger district level data for that data type. We keep the user's year/state selections if they are a valid filter within the new data.

### Data Visualization

We use Mapbox GL for rendering the maps on the trapping and predictions pages. We have a Mapbox account (see Handoff Document for account details) where we generated a specific map style for the site. We also uploaded specific tilesets to this Mapbox account and style for the ranger district and county shapes. We use Mapbox click and hover events for rendering tooltips and making selections. Each click handler that must use data from redux has to be re-generated when data changes, in order for the function to be bound to the current value of the variable. We leverage the `useEffect` and `useState` hooks from React in our map components to achieve this.

We use Chart.js for rendering the graph on the trapping data page. We use a line graph component with three segments to make this happen. Chart.js renders the data on a canvas layer and handles all internal animations.

## Code Style

We use React functional components and hooks in all of our components. We leverage the `useState` and `useEffect` hooks throughout each of our components.

We use async/await for all asynchronous functions.

## Deployment

Continuous deployment is setup with Netlify.

Merging a PR to the `dev` branch will trigger a new build in the dev environment. When the build passes, an update will be released at [https://pine-beetle-prediction-dev.netlify.app](https://pine-beetle-prediction-dev.netlify.app).

Merging a PR to the `release` branch will trigger a new build in the production environment. When the build passes, an update will be released at [https://pine-beetle-prediction.netlify.app](https://pine-beetle-prediction.netlify.app).

Pull requests should always be first merged into the `dev` branch so they are staged in the development environment. After smoke testing the changes in the development environment, developers can then choose to release those changes into production by generating a `DEV TO RELEASE` pull request from the `dev` branch to the `release` branch. One this single PR is merged into `release`, the changes will be built into the production environment and will be viewable at the production URL [https://pine-beetle-prediction.netlify.app](https://pine-beetle-prediction.netlify.app).

## Contributors

- Jeff Liu

### Past Project Members

- Thomas Monfre
- Alejandro Lopez
- Grace Wang
- Maria Cristoforo
- Angela Zhang
- Nathan Schneider
- John McCambridge
- Madeline Hess
- Isabel Hurley
- Anuj Varma
- Emma Langfitt
