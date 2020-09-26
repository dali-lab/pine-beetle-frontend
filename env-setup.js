const fs = require('fs');

console.log(process.env);

fs.writeFileSync('./.env', `MAPBOX_ACCESS_TOKEN=${process.env.MAPBOX_ACCESS_TOKEN}\n`);
