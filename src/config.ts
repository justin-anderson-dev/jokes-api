import * as dotenv from 'dotenv';

dotenv.config({
  path: '${__dirname}/../.env'
});

export const port: Number = Number(process.env.API_PORT);
export const host: String = String(process.env.DB_HOST);
export const database: String = String(process.env.DB_NAME);
export const user: String = String(process.env.DB_USER);
export const password: String = String(process.env.DB_PASSWORD);
