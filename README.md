# Pine Beetle

### Notes for dev

__install node, yarn, mongo__
* for mac:

	`brew install node`

	`brew install yarn`

	`brew install mongo`

* install other dependencies:

	`yarn install`

* run the dev server:

	`yarn dev`

I was able to locally import the csv file in src/data with: `mongoimport --db pb-dev --collection spot-prediction --type csv --headerline --file ./pb-backend/src/data/sample_import_data.csv`
