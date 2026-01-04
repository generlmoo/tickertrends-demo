import 'reflect-metadata';
import { ConnectionOptions } from 'typeorm';
import { Trend } from './src/entities/Trend';

const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'tickertrends',
    synchronize: false,
    logging: false,
    entities: [Trend],
    migrations: ['./src/migrations/*.ts'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};

export = config;