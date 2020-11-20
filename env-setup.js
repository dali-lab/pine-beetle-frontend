const fs = require('fs');

fs.writeFileSync('./.env', `MAPBOX_ACCESS_TOKEN=${process.env.MAPBOX_ACCESS_TOKEN}\n`);
