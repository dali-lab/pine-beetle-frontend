const fs = require('fs');

fs.writeFileSync('./.env', `MAPBOX_ACCESS_TOKEN=${process.env.MAPBOX_ACCESS_TOKEN}
ANALYTICS_ENV=${process.env.ANALYTICS_ENV}
MAIN_BACKEND_ENV=${process.env.MAIN_BACKEND_ENV}
AUTOMATION_ENV=${process.env.AUTOMATION_ENV}
`);
