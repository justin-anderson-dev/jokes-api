require('dotenv').config({ path: './.env' });
const execSync = require('child_process').execSync;
const command = `PGPASSWORD=${process.env.DB_PASSWORD} psql -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -p ${process.env.DB_PORT} -f db/dropTables.sql`;
execSync(command, { stdio: 'inherit' });
