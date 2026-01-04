import axios from 'axios';
import { LeaderboardRow, TermSeries } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
});

export const submitTerm = async (term: string, startDate?: string, endDate?: string): Promise<TermSeries> => {
  const response = await client.post('/trends', { term, startDate, endDate });
  return response.data as TermSeries;
};

export const fetchTermSeries = async (term: string): Promise<TermSeries> => {
  const response = await client.get(`/trends/${encodeURIComponent(term)}`);
  return response.data as TermSeries;
};

export const fetchLeaderboard = async (): Promise<LeaderboardRow[]> => {
  const response = await client.get('/trends');
  return response.data as LeaderboardRow[];
};
