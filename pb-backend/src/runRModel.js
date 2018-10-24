var R = require("r-script");

//TODO errs with 'cannot open the connection' unless full path name specified
var obj = R("/Users/isabelhurley/DALI/pine-beetle/project-pine-beetle/pb-backend/src/ModelDescription.R")
console.log(obj)
obj.call(function(err, d) {
		if (err) throw err;
		console.log(d);
	});