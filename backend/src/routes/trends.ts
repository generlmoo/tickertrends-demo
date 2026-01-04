import { Request, Response, Router } from 'express';
import { TrendService } from '../services/trendService';
import { UpstreamBlockedError } from '../utils/fetchMuckrack';

export const trendsRouter = Router();
const trendService = new TrendService();

// Create or refresh a term's timeseries and persist it.
trendsRouter.post('/', async (req: Request, res: Response) => {
    const { term, startDate, endDate } = req.body as { term?: string; startDate?: string; endDate?: string };

    if (!term) {
        return res.status(400).json({ message: 'term is required' });
    }

    try {
        const series = await trendService.fetchAndStoreTrends(term.trim(), startDate, endDate);
        return res.status(200).json(series);
    } catch (error) {
        if (error instanceof UpstreamBlockedError) {
            return res.status(502).json({ code: error.code, message: error.message });
        }

        return res.status(500).json({ message: 'Error fetching trends data', error: (error as Error).message });
    }
});

// Fetch leaderboard ordered by growth.
trendsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const leaderboard = await trendService.getLeaderboard();
        return res.status(200).json(leaderboard);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching trends', error: (error as Error).message });
    }
});

// Fetch stored timeseries for a term.
trendsRouter.get('/:term', async (req: Request, res: Response) => {
    try {
        const series = await trendService.getSeries(req.params.term);
        return res.status(200).json(series);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching term series', error: (error as Error).message });
    }
});