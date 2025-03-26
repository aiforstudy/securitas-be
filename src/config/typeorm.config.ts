import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Load the appropriate .env file
config({
  path: path.resolve(`configurations/.env.${process.env.NODE_ENV || 'local'}`),
});

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const password = configService.get<string>('database.password');
  if (typeof password !== 'string') {
    throw new Error('Database password must be a string');
  }

  return {
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: password,
    database: configService.get<string>('database.database'),
    // schema: configService.get<string>('database.schema'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    synchronize: configService.get('nodeEnv') !== 'production',
    logging: configService.get('nodeEnv') !== 'production',
  };
};

export default new DataSource({
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: String(process.env.DB_PASSWORD || 'postgres'),
  database: process.env.DB_DATABASE || 'postgres',
  // schema: process.env.DB_SCHEMA || 'public',
  migrations: ['src/migrations/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
});
