# Pine Beetle

### Notes for dev
Find `index.html` in `src/` currently. (We may reorganize a bit later to have frontend and backend code living in the same repo)

__install node, yarn, mongo__
* for mac:

	`brew install node`

	`brew install yarn`

	`brew install mongo`

* install other dependencies:

	`yarn install`

* run the dev server:

	`yarn dev`

I was able to locally import the csv file in src/data with: `mongoimport --db pb-dev --collection spot-prediction --type csv --headerline --file ./src/data/sample_import_data.csv`

### Starter pack
Includes express, node, and mongo dependencies (API, server, database)