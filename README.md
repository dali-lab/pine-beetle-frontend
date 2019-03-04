# Project Pine Beetle
Last Updated: 3.1.2019
## Table of Contents
- Project Overview
- Project Architecture
- Developer Information
- Project Status
- Authors
- Acknowledgements

## Project Overview
Project Pine Beetle is a web application that visualizes data on Southern Pine Beetle outbreaks in 16 states across the US. This tool uses a predictive model to predict future outbreaks and movements of Southern Pine Beetles.

On the front-end, this application provides valuable information for USFS researchers and state forest rangers to see information related to past outbreaks and predictions about future outbreaks. This application also provides information to the general public about threats facing their communities.

On the back-end, this application aggregates data collected from USFS and state forest rangers on outbreaks and beetle counts, then uses those values to display historical data and future predictions. The predictive model used to generate predictions is written in R. All data is stored in a NoSQL database, allowing for easy pre and post-processing. Using an Express server, all calculations are made in JavaScript (outside of the predictive model), and all data is stored in JSON format.

Project Pine Beetle is a collaboration between Professor Matt Ayres of Dartmouth College, Professor Carissa Aoki of Bates College, the United States Forest Service (USFS), and the Dartmouth Applied Learning and Innovation (DALI) Lab.

## Project Architecture
### Front-end
The front-end of this application is a public interface for users to view pine beetle infestation predictions and spot/trapping data from previous years. The data is visualized with a series of maps and graphs. Maps are generated using [Mapbox](https://www.mapbox.com/), and graphs are generated using [Chart.js](https://www.chartjs.org/).

The site can be viewed at https://pine-beetle-prediction.surge.sh. As of March 2019, the web application consists of four primary pages. With future development, we hope to expand the interface further to provide more functionality and data to users. These pages are as follows:

#### Home Page:
Simple landing page to direct users across the site.

#### About Page:
Displays descriptions about the project and its partners, as well as high-level information about the risk of pine beetle outbreaks nationwide.

#### Historical Data Page:
Pulls data from the database for analysis and visualization. All data viewed on this page is on previous years. Users can filter by year range, state, and forest. Data visualiation is based on a geographic level as well as a year-by-year level. This page is mostly useful for viewing trends in beetle movements in previous years.

#### Predictive Model Page:
Runs the predictive model to generate predictions about future outbreaks on a state and forest level. Users select a year to run the model on as well as a state. Predictions come in the following format: probability of seeing 0 spots (outbreaks), probability of at least 1 spot, probability of at least 20 spots, probability of at least 54 spots, probability of at least 148 spots, probability of at least 403 spots, and probability of at least 1096 spots. These values form a probabilistic distribution by an inverse logarithmic function. Predictions are generated with a linear regression forming a Poisson distribution.

Predictions come in for each forest in the state and can be viewed on a distribution plot as well as a choropleth map showing outbreaks by geographical forest/county.

### Back-end
You can the back-end repository [here](https://github.com/dali-lab/pine-beetle-backend).

## Developer Information
### Installation:
#### Tools:
- You will need [Node.js](https://nodejs.org/en/), [yarn](https://yarnpkg.com/en/), [mongo/mongoDB](https://www.mongodb.com/), and [heroku](https://www.heroku.com) installed locally in order to build, run and develop this project.

- Tool installation instructions (for mac, using homebrew)
	- `brew install node` (you will need version >=9.x and <= 10.x)
		- Note: for advanced usage, we also recommend installing Node.js via a version manager such as [nvm](https://github.com/creationix/nvm) instead of with homebrew. To do so, run `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`. Be sure to set your `.bash_profile` file by following the instructions listed in the [nvm repository](https://github.com/creationix/nvm).
	- `brew install yarn`
	- `brew install mongo`
	- `brew install heroku/brew/heroku`
	- `brew install python`
	- `brew install R`

#### Front-end repository:
- For the front-end, run `git clone https://github.com/dali-lab/pine-beetle-frontend`.
- `cd pine-beetle-frontend`. Then make sure you are on the master branch.
- Install necessary packages and dependencies with `yarn install`.


The front-end was scaffolded with Facebook's [Create React App](https://github.com/facebook/create-react-app). See below for the following available commands.

##### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

##### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

##### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Front-end Repo Structure

The front-end is built with React.js and deployed with surge. Please contact pine-beetle@dali.dartmouth.edu for access to `.env` files. 

#### Contents
- `src/components` contains all React components.
- `src/styles` contains all CSS.
- `src/assets` contains all images. 
- `build` contains the production build of the site. Deploy from this directory after running `yarn build`

#### Deploying Changes
- The frontend is deployed using surge. Make sure you install it if you don’t already have it: `npm install --global surge`
- Next navigate to `build` and run `yarn build` then `surge --domain [insert domain name here]`. The CNAME file will automatically deploy to `pine-beetle-prediction.surge.sh`, but you must have permissions to deploy to this URL. Use `--domain` to override this and deploy to your own URL.
- Visit https://pine-beetle-prediction.surge.sh/ to see project

## Project Status
As of March 6th, 2019, Project Pine Beetle will not be under active development. It is intended to be under active development again starting in Fall 2019.

### Implemented: Fall, 2018
- Database in MongoDB developed
- Historical data (1986-2010) uploaded to DB
- Pipeline constructed for uploading Survey123 data to DB
- Frontend framework developed
- Data retrieval from database implemented
- Data handling on front-end implemented
- User selection tools implemented
- Rudimentary data visualization in map form implemented
- Rudimentary data wrangling implemented
- Predictive model implemented to run in R through JavaScript
- Model updating process implemented

### Implemented: Winter, 2019
- Finalized data pipeline from Survey123 to MongoDB
- Created numerous routes on the back-end to query and serve data to the front-end
- Constructed capability to run R model using various feature inputs as well with a year/state/forest combination.
- Created routes for running the R model and returning results to front-end
- Converted front-end to React.js
- Built full historical data visualization
- Built full predictive model page
- Implemented fresh redesigns
- Constructed private capability for partners to pull Survey123 data to the database

### Expected Implementation: Fall, 2019
- Improve pipeline from Survey123 to MongoDB for updated previously seen data
- Fix problems seen with Spring 2019 data collection
- Improve model
- Improve run/load-times
- Cache/store previous model runs on server or in database to both improve run times and allow future versions of the predictive model to use previous model runs as inputs
- Implement a CDN
- Improve historical data visualization and predictive model visualization
- Add more educational and explanatory features/information for the general public to learn about this problem and this tool
- Implement additional features requested by the partners


### Future Directions
This product illustrates the threats facing communities in a visual manner. It is well suited to visualize any epidemic or spreading threat. It could be generalized and implemented for visualizing risk of forest fires, spread of disease, genetic diversity, or any threat that is predictable, has the potential to propagate outward, and displays a set of observable qualities indicating risk. Southern Pine Beetles may be just the beginning to the uses of a tool like this.

## Team Members

### Fall 2018
- Thomas Monfre, Project Manager
- Madeline Hess, Developer
- Isabel Hurley, Developer

### Winter 2019
- Mo Zhu, Project Manager
- Thomas Monfre, Developer
- Madeline Hess, Developer
- Emi Hayakawa, Designer
- Bella Jacoby, Designer

## README Authors
Thomas Monfre, Isabelle Hurley, Madeline Hess.

## Acknowledgements
- This project was built in partnership with Professor Carissa Aoki of Bates College and Professor Matt Ayres of Dartmouth College. We thank them for approaching the DALI Lab and cooperating with us to build this product.
- We would like to thank many representatives from the US Forest Service and the Georgia Forestry Commission for their help, feedback and willingness to participate in user interviews. Particular thanks to Michael Torbett.
- Thank you to Tim Tregubov, Lorie Loeb, Natalie Jung, and Erica Lobel for their help, guidance, and advice.
- Shout out to Paula Mendoza for guiding us during the first part of this project. The direction of the final product is in large part the result of your positive, guiding influence. Thanks!
- Model for writing up this README drawn from https://github.com/dartmouth-cs98/18w-si32