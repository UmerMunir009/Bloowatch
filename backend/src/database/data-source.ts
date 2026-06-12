import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  
  migrations: ['src/database/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});