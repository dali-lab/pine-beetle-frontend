var R = require("r-script");

export const makePredictions = (SPB, cleridst1, spotst1, spotst2, endobrev) => {
	//TODO errs with 'cannot open the connection' unless full path name specified
	var obj = R("/Users/isabelhurley/DALI/pine-beetle/project-pine-beetle/pb-backend/src/SPB-Predictions.v02.R")
	// var obj = R('./SPB-Predictions.v02.R')
	obj
		.data({
			SPB, 
			cleridst1, 
			spotst1, 
			spotst2, 
			endobrev
		})
		.call(function(err, d) {
			if (err) throw err;
			// console.log(d); // logs successfully
			return d;
		});
}

// makePredictions(2000, 582, 1006, 400, 1);
