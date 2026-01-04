import { getRepository } from 'typeorm';
import { DEFAULT_START_DATE } from '../config';
import { Term } from '../entities/Term';
import { Trend } from '../entities/Trend';
import { UpstreamBlockedError, fetchMuckrack, TrendPoint } from '../utils/fetchMuckrack';

export interface TrendSeries {
    term: string;
    series: Trend[];
    startValue: number;
    endValue: number;
    growthPercentage: number;
    hasData: boolean;
    lastScrapeStatus: number | null;
    lastScrapeError: string | null;
}

export class TrendService {
    private trendRepo() {
        return getRepository(Trend);
    }

    private termRepo() {
        return getRepository(Term);
    }

    async fetchAndStoreTrends(term: string, startDate?: string, endDate?: string): Promise<TrendSeries> {
        const rangeStart = startDate || DEFAULT_START_DATE;
        const rangeEnd = endDate || new Date().toISOString().slice(0, 10);

        const termRecord = await this.ensureTerm(term);

        try {
            const points = await fetchMuckrack(term, rangeStart, rangeEnd);
            if (!points.length) {
                await this.updateTermStatus(termRecord, 204, 'No data returned');
                return { term, series: [], startValue: 0, endValue: 0, growthPercentage: 0, hasData: false, lastScrapeStatus: 204, lastScrapeError: 'No data returned' };
            }

            await this.trendRepo().delete({ term });

            const growth = computeGrowth(points);
            const entities = points.map((point) =>
                this.trendRepo().create({ ...point, growthPercentage: growth })
            );

            const series = await this.trendRepo().save(entities);
            await this.updateTermStatus(termRecord, 200, null);
            return { term, series, ...growthBreakdown(points), hasData: true, lastScrapeStatus: 200, lastScrapeError: null };
        } catch (error) {
            const status = error instanceof UpstreamBlockedError ? error.status ?? 403 : 500;
            const message = (error as Error).message;
            await this.updateTermStatus(termRecord, status, message);
            throw error;
        }
    }

    async getSeries(term: string): Promise<TrendSeries> {
        const series = await this.trendRepo().find({ where: { term }, order: { date: 'ASC' } });
        const termRecord = await this.termRepo().findOne({ where: { term } });

        if (!series.length) {
            return {
                term,
                series: [],
                startValue: 0,
                endValue: 0,
                growthPercentage: 0,
                hasData: false,
                lastScrapeStatus: termRecord?.lastScrapeStatus ?? null,
                lastScrapeError: termRecord?.lastScrapeError ?? null,
            };
        }

        const points: TrendPoint[] = series.map((row) => ({ term: row.term, date: row.date, value: row.value }));
        return {
            term,
            series,
            ...growthBreakdown(points),
            hasData: true,
            lastScrapeStatus: termRecord?.lastScrapeStatus ?? null,
            lastScrapeError: termRecord?.lastScrapeError ?? null,
        };
    }

    async getLeaderboard(): Promise<Array<Omit<TrendSeries, 'series'>>> {
        const records = await this.trendRepo().find({ order: { date: 'ASC' } });
        const grouped = new Map<string, TrendPoint[]>();

        for (const record of records) {
            const points = grouped.get(record.term) || [];
            points.push({ term: record.term, date: record.date, value: record.value });
            grouped.set(record.term, points);
        }

        const termRows = await this.termRepo().find();
        const termMap = new Map(termRows.map((row) => [row.term, row] as const));

        const allTerms = new Set<string>([...grouped.keys(), ...termMap.keys()]);

        const leaderboard = Array.from(allTerms).map((term) => {
            const points = grouped.get(term) || [];
            const { startValue, endValue, growthPercentage } = growthBreakdown(points);
            const hasData = points.length > 0;
            const termRecord = termMap.get(term);

            return {
                term,
                startValue,
                endValue,
                growthPercentage,
                hasData,
                lastScrapeStatus: termRecord?.lastScrapeStatus ?? null,
                lastScrapeError: termRecord?.lastScrapeError ?? null,
            };
        });

        return leaderboard.sort((a, b) => (b.growthPercentage || 0) - (a.growthPercentage || 0));
    }

    async getTrackedTerms(): Promise<string[]> {
        const trendTerms = await this.trendRepo()
            .createQueryBuilder('trend')
            .select('DISTINCT trend.term', 'term')
            .getRawMany<{ term: string }>();

        const termRows = await this.termRepo().find({ select: ['term'] });
        const combined = new Set<string>([...trendTerms.map((row) => row.term), ...termRows.map((row) => row.term)]);
        return Array.from(combined);
    }

    private async ensureTerm(term: string): Promise<Term> {
        const existing = await this.termRepo().findOne({ where: { term } });
        if (existing) return existing;
        return this.termRepo().save(this.termRepo().create({ term }));
    }

    private async updateTermStatus(term: Term, status: number | null, error: string | null): Promise<void> {
        await this.termRepo().save({ ...term, lastScrapeStatus: status, lastScrapeError: error });
    }
}

const computeGrowth = (points: TrendPoint[]): number => {
    if (!points.length) return 0;
    const startValue = points[0].value;
    const endValue = points[points.length - 1].value;
    if (startValue === 0) return 0;
    return ((endValue - startValue) / startValue) * 100;
};

const growthBreakdown = (points: TrendPoint[]) => {
    const startValue = points.length ? points[0].value : 0;
    const endValue = points.length ? points[points.length - 1].value : 0;
    return {
        startValue,
        endValue,
        growthPercentage: computeGrowth(points),
    };
};