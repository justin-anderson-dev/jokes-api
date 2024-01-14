const execSync = require('child_process').execSync;
const command = `PGPASSWORD=${process.env.DB_PASSWORD} psql -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f db/build-tables.sql`;
execSync(command, { stdio: 'inherit' });
