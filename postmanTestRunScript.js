require('dotenv').config({ path: './.env' });
const execSync = require('child_process').execSync;
const command = `postman login --with-api-key ${process.env.POSTMAN_API_KEY} && postman collection run 32293556-f1a3da05-62d9-4f03-9f50-322563845703`;
execSync(command, { stdio: 'inherit' });
