import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

// Load the appropriate .env file based on NODE_ENV
const envPath = path.resolve(
  `configurations/.env.${process.env.NODE_ENV || 'local'}`,
);
config({ path: envPath });

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'securitas',
  migrations: ['src/migrations/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
};

export default new DataSource(dataSourceOptions);
