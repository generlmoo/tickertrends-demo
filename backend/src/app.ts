import express from 'express';
import { json } from 'body-parser';
import { trendsRouter } from './routes/trends';

const app = express();

app.use(json());
app.use('/api/trends', trendsRouter);

export default app;