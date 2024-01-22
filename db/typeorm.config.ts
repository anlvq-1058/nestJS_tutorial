import { DataSource } from 'typeorm';
import 'dotenv/config';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: ['src/**/entities/*.entity{.ts,.js}'],
  // synchronize: true,
  migrations: ['db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  logging: true,
});
