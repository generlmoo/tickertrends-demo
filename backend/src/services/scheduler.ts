import cron from 'node-cron';
import { CRON_SCHEDULE, DEFAULT_START_DATE } from '../config';
import { TrendService } from './trendService';

const trendService = new TrendService();

export const scheduleDataUpdate = () => {
    cron.schedule(CRON_SCHEDULE, async () => {
        const terms = await trendService.getTrackedTerms();

        // Fall back to a starter term so the job always does useful work.
        const targets = terms.length ? terms : ['crocs'];

        for (const term of targets) {
            try {
                await trendService.fetchAndStoreTrends(term, DEFAULT_START_DATE);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`Cron update failed for term ${term}:`, error);
            }
        }
    });
};