export interface TrendPoint {
    id?: number;
    term: string;
    date: string;
    value: number;
    growthPercentage: number;
}

export interface TermSeries {
    term: string;
    series: TrendPoint[];
    startValue: number;
    endValue: number;
    growthPercentage: number;
}

export interface LeaderboardRow {
    term: string;
    startValue: number;
    endValue: number;
    growthPercentage: number;
}