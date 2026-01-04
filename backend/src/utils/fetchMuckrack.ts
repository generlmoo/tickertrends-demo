import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { MOCK_MUCKRACK, MUCKRACK_API_URL } from '../config';

export interface TrendPoint {
    term: string;
    date: string;
    value: number;
}

export class UpstreamBlockedError extends Error {
    code = 'UPSTREAM_BLOCKED' as const;

    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}

interface MuckrackSeriesShape {
    [date: string]: number | string;
}

/**
 * Fetch and normalize Muckrack trend data for a given term and date range.
 */
export const fetchMuckrack = async (term: string, startDate: string, endDate: string): Promise<TrendPoint[]> => {
    const url = `${MUCKRACK_API_URL}?terms=${encodeURIComponent(`"${term}"`)}&daterange_starts=${startDate}&daterange_ends=${endDate}`;

    if (MOCK_MUCKRACK) {
        const series = loadMockSeries();
        return normalizeSeries(series, term);
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                accept: 'application/json,text/plain,*/*',
                referer: `https://muckrack.com/trends/report/?terms=${encodeURIComponent(`"${term}"`)}&daterange_starts=${startDate}&daterange_ends=${endDate}`,
            },
            timeout: 15000,
            validateStatus: (status) => status >= 200 && status < 300,
        });

        const payload = response.data as unknown;

        // If the response is HTML (Cloudflare challenge), fail with a clear message.
        if (isHtmlChallenge(payload)) {
            throw new UpstreamBlockedError('Blocked by source site (Cloudflare). Please retry later.', response.status);
        }

        const series = extractSeries(payload);

        const points = normalizeSeries(series, term);

        if (!points.length) {
            throw new UpstreamBlockedError('No data returned from source. It may be temporarily blocking requests.', response.status);
        }

        return points;
    } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 403) {
            throw new UpstreamBlockedError('Blocked by source site (HTTP 403).', status);
        }

        // eslint-disable-next-line no-console
        console.error('Error fetching Muckrack data:', error);
        const message =
            error instanceof Error && error.message
                ? error.message
                : 'Failed to fetch Muckrack data';
        throw error instanceof Error ? error : new Error(message);
    }
};

const extractSeries = (payload: unknown): MuckrackSeriesShape => {
    if (!payload || typeof payload !== 'object') return {};

    const anyPayload = payload as Record<string, unknown>;

    const candidates: Array<MuckrackSeriesShape | undefined> = [
        (anyPayload.data as { series?: MuckrackSeriesShape })?.series,
        anyPayload.series as MuckrackSeriesShape,
        Array.isArray(anyPayload) ? (anyPayload[0] as { series?: MuckrackSeriesShape })?.series : undefined,
    ];

    for (const candidate of candidates) {
        if (candidate && typeof candidate === 'object' && Object.keys(candidate).length > 0) {
            return candidate;
        }
    }

    return {};
};

const normalizeSeries = (series: MuckrackSeriesShape, term: string): TrendPoint[] =>
    Object.entries(series)
        .map(([date, value]) => ({
            term,
            date,
            value: typeof value === 'string' ? Number(value) : Number(value ?? 0),
        }))
        .filter((point) => !Number.isNaN(point.value))
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

const isHtmlChallenge = (payload: unknown): boolean => {
    if (typeof payload !== 'string') return false;
    const lowered = payload.toLowerCase();
    return lowered.includes('<html') || lowered.includes('cf-challenge') || lowered.includes('cloudflare');
};

let cachedMockSeries: MuckrackSeriesShape | null = null;

const loadMockSeries = (): MuckrackSeriesShape => {
    if (cachedMockSeries) return cachedMockSeries;

    const fixturePath = path.join(__dirname, '..', 'fixtures', 'mockTrend.json');
    const raw = fs.readFileSync(fixturePath, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    const series = extractSeries(parsed);
    cachedMockSeries = series;
    return series;
};