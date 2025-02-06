const fs = require('fs');
const buffer = Buffer.from([0,0,1,0,1,0,16,16,0,0,1,0,24,0,68,4,0,0,22,0,0,0]);
fs.writeFileSync('public/favicon.ico', buffer);
