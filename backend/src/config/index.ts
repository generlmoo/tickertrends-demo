import { config as loadEnv } from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import { Term } from '../entities/Term';
import { Trend } from '../entities/Trend';

loadEnv();

export const MUCKRACK_API_URL = 'https://muckrack.com/trends/report/data/';
export const DEFAULT_START_DATE = '2010-01-01';
export const PORT = Number(process.env.PORT || 5000);
export const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 */3 * * *'; // every 3 hours
export const MOCK_MUCKRACK = process.env.MOCK_MUCKRACK === '1' || process.env.MOCK_MUCKRACK === 'true';

export const databaseConfig: ConnectionOptions = {
	type: 'postgres',
	url: process.env.DATABASE_URL,
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
	username: process.env.DB_USERNAME || 'postgres',
	password: process.env.DB_PASSWORD || 'postgres',
	database: process.env.DB_NAME || 'tickertrends',
	entities: [Trend, Term],
	migrations: ['src/migrations/*.ts'],
	synchronize: false,
	ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};