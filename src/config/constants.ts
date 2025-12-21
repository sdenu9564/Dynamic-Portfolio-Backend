import * as dotenv from 'dotenv';
dotenv.config();


interface Config {
  NODE_ENV?: string | undefined;
  PORT: string | number;
  isDev: boolean;
  ALLOWED_DOMAIN: string | undefined;
}

const config: Config = {
  ALLOWED_DOMAIN: process.env.DASHBOARD_APP_ORIGIN,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 9000,
  isDev: process.env.NODE_ENV === 'development',
};

export default config;
