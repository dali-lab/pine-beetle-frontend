# Project Pine Beetle
Last Updated: 11.5.2018
## Table of Contents
- Project Overview
- Project Architecture
- Developer Information
- Project Status
- Authors
- Acknowledgements
## Project Overview
Project Pine Beetle is a web application that visualizes the risk of pine beetle outbreaks in forests across the united states. On the frontend, it provides anybody from kindergarten through the upper ranks of the US Forest Service with information about the threats facing their communities. On the backend, it aggregates data collected from US Forest Rangers on forest health stored in a variety of sources into a NoSQL database perfect for processing and visualizing data in JSON format.
## Project Architecture
### Frontend
Public interface for users to view pine beetle infestation predictions and spots and trappings data visualized through a set of maps and graphs. You can see the site by visiting: http://pine-beetle-prediction.surge.sh/
Right now, the web application consists of three pages, but we hope to expand the interface as work continues on this project. These pages are as follows:
#### Home Page:
Displays descriptions about the project and its partners, as well as high-level information about the risk of pine beetle outbreaks nationwide.
#### View Data Page:
Pulls data from the DB for analysis and visualization. All data manipulation happens on the frontend so as to allow users to quickly apply different filters to view the data in different ways. At the moment, users can apply temporal and geographical filters, see basic metrics, and visualize data in a rudimentary map. We hope to extend the visualization capacity of the project in future work now that the backend infrastructure has been constructed.
#### About Page:
Displays detailed information about the project, partners and next steps.
### Backend
#### Database (DB):
Non-relational database built using MongoDB, responsible for storing data on pine beetle trappings and spots. The DB was pre-populated with data collected from 1986-2018 which was stored locally and can be seen in `project-pine-beetle/pb-backend/src/data/`. Additionally, data is imported to the DB from Survey123, a data collection platform built on top of ArcGIS. All entries drawn from Survey123 are imported exactly as entered, and are updated any time they are changed in Survey123, ensuring they mirror Survey123 exactly.
#### Data:
Trapping data is entered in the spring. Spot data is entered in the fall and winter. For information of variable names, see `project-pine-beetle/pb-backend/src/data/` to find the cookbook. Between Spring 2017 and Spring 2018, the USFS shifted over from manual data collection (Microsoft Excel) to data collection through Survey123, an online platform built on top of ArcGIS. A representation of the manually collected data can be seen in `project-pine-beetle/pb-backend/src/data/`, as well as within the DB. Survey123 data is visible both through the DB and through the Survey123 platform. Information on querying data from Survey123 and ArcGIS can be found at https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm#
## Developer Information
### Installation:
#### Tools:
- You will need node, yarn, mongo and heroku in order to build, run and develop this project
- Tool installation instructions (for mac, using homebrew)
	- `brew install node` (you will need version >=9.x and <= 10.x)
	- `brew install yarn`
	- `brew install mongo`
	- `brew install heroku/brew/heroku`
	- `brew install python`
- You will also need to have R installed locally on your computer if you would like to test out the R model locally, (it isn't deployed yet!) For more information see, https://cran.r-project.org/.
#### Project:
- Clone repository
  git clone https://github.com/dali-lab/project-pine-beetle.git
- Make sure you are on the branch master
- Navigate to `project-pine-beetle/`
- Install necessary packages and dependencies yarn install
	- For frontend, navigate to `project-pine-beetle/pb-frontend/`
	- Run `yarn install`
	- To build and serve frontend to client:
	- Navigate to `src/`
	- Run `python -m http.server 8080 for Python 3.x or python -m SimpleHTTPServer 8080 for Python 2.x`
	(Use a python server to bypass cross-scripting issues)
- For backend, navigate to `project-pine-beetle/pb-backend`
	- Run `yarn install`
	- Run `yarn start` to see a sample of the predictive model (written in R) running on preset inputs. (The model has not yet been implemented, this is just for testing)
	- Run `yarn dev` to run the dev server
### Repo Structure
- Code for frontend development is contained in the `pb-frontend/` directory
- Code for backend development and DB development is contained in `pb-backend/`
- Code for transfering data (Survey123 → DB, DB → frontend) is contained in `importing-scripts/` and is not yet fully implemented
### Frontend
#### Contents
- Navigate to `pb-frontend/`
- All hidden files are used to download a developer’s starter-pack (see Frontend: Setup section)
- Code constructing website pages is contained in `src/`
	- All .html files in `src/` construct the pages with corresponding tab names as seen on the site
	- `scripts/` contains JavaScript files used to implement certain features of the site (ex. Map, visualizations, data filtering, etc.)
	- `images/` contains images shown on site
	- `styles/` contains CSS style files for each HTML page on the site
	- Note: The front end has not yet been connected to the DB so historical_data.json (the historical data collected before the USFS’s implementation of Survey123) is currently being used as a stand-in, as it has the same structure as data queried from the DB will have.
#### Deploying Changes
- The frontend is deployed using surge, so first make sure you install surge if you don’t already have it!
	`npm install --global surge`
- Next navigate to pb-frontend/
	`yarn build`
	`yarn deploy`
- Visit http://pine-beetle-prediction.surge.sh/ to see project
### Backend
#### Exploring the DB
- Before you start anything, make sure mongo is installed correctly
- Run `mongod`
- Run `mongo`
- Run `use db`
- Explore!
#### Adding Data to DB
To locally import the csv file in `src/data/`:
`mongoimport --db pb-dev --collection spot-prediction --type csv --headerline --file ./pb-backend/src/data/sample_import_data.csv`
#### Deployment
Deploying the db to heroku is not working yet, but we’re working on it! Instructions will be uploaded within the next two weeks.
## Project Status
As of November 16th, 2018, Project Pine Beetle will not be under active development. It is intended to be under active development again starting January 3rd, 2019.
### Implemented: Fall, 2018
- Database in MongoDB Developed
- Historical data (1986-2018) uploaded to DB
- Pipeline constructed for uploading Survey123 data to DB
- Frontend framework developed
- Data retrieval from DB implemented
- Data handling in frontend implemented
- User selection tools implemented
- Rudimentary data visualization in map form implemented
- Rudimentary data wrangling implemented
- Aoki-Ayres Model implemented to run in R through JavaScript
- Model updating process implemented
### Expected Implementations: Winter, 2019
- Given completed data processing on frontend, begin constructing data visualizations as per Aoki-Ayres specification
### Future Directions
This product illustrates the threats facing communities in a visual manner. It is well suited to visualize any epidemic or spreading threat. It could be generalized and implemented for visualizing risk of forest fires, spread of disease, genetic diversity, or any threat that is predictable, has the potential to propagate outward, and displays a set of observable qualities indicating risk.
## Authors
Thomas Monfre, Isabelle Hurley, Madeline Hess.
## Acknowledgements
- This project was built in partnership with Professor Carissa Aoki of Bates College and Professor Matt Ayres of Dartmouth College, as well as with representatives from the US Forest Service.
- Shout out to Paula Mendoza for guiding us during the first part of this project! The direction of the final product is in large part the result of your positive, guiding influence. Thanks!
- Model for writing up this README drawn from https://github.com/dartmouth-cs98/18w-si32
