import * as dotenv from 'dotenv';

dotenv.config({
  path: '${__dirname}/../.env'
});

export const port = Number(process.env.API_PORT);
export const db_host = String(process.env.DB_HOST);
export const db_port = Number(process.env.DB_PORT);
export const db_name = String(process.env.DB_NAME);
export const db_user = String(process.env.DB_USER);
export const db_password = String(process.env.DB_PASSWORD);

export const jwt_secret = String(process.env.JWT_SECRET);
export const jwt_audience = String(process.env.JWT_AUDIENCE);
export const jwt_issuer = String(process.env.JWT_ISSUER);

export const prefix = String(process.env.API_PREFIX);
export const version = String(process.env.API_VERSION);
export const base_url = `${prefix}/${version}`;
