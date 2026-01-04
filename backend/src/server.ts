import express, { NextFunction, Request, Response } from 'express';
import { json } from 'body-parser';
import { createConnection } from 'typeorm';
import { CRON_SCHEDULE, databaseConfig, PORT } from './config';
import { trendsRouter } from './routes/trends';
import { scheduleDataUpdate } from './services/scheduler';

const app = express();

app.use(json());
app.use((_: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    next();
});

app.use('/api/trends', trendsRouter);

createConnection(databaseConfig)
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('Connected to the database');
        // eslint-disable-next-line no-console
        console.log(`Cron schedule: ${CRON_SCHEDULE}`);
        scheduleDataUpdate();
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Database connection error:', error);
    });