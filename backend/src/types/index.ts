export interface Trend {
    id: number;
    term: string;
    date: string;
    mentions: number;
    growthPercentage: number;
}

export interface TrendData {
    trends: Trend[];
    totalMentions: number;
    averageGrowth: number;
}

export interface FetchTrendResponse {
    success: boolean;
    data: TrendData;
    message?: string;
}