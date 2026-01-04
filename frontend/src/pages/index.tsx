import { useEffect, useState } from 'react';
import GrowthTable from '../components/GrowthTable';
import Layout from '../components/Layout';
import TermForm from '../components/TermForm';
import TrendChart from '../components/TrendChart';
import { fetchLeaderboard, fetchTermSeries, submitTerm } from '../lib/api';
import { LeaderboardRow, TermSeries } from '../types';

const Home = () => {
  const [selectedTerm, setSelectedTerm] = useState('');
  const [termSeries, setTermSeries] = useState<TermSeries | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [loadingTerm, setLoadingTerm] = useState(false);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = async () => {
    try {
      setLoadingBoard(true);
      const rows = await fetchLeaderboard();
      setLeaderboard(rows);
    } catch (err) {
      setError((err as Error).message || 'Unable to load leaderboard');
    } finally {
      setLoadingBoard(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const handleTermSubmit = async (term: string) => {
    setError(null);
    setLoadingTerm(true);
    setSelectedTerm(term);
    try {
      await submitTerm(term);
      const series = await fetchTermSeries(term);
      setTermSeries(series);
      await loadLeaderboard();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const apiMsg = axiosErr.response?.data?.message;
      setError(apiMsg || axiosErr.message || 'Unable to fetch term');
    } finally {
      setLoadingTerm(false);
    }
  };

  const hasSeries = termSeries && termSeries.series.length > 0;

  return (
    <Layout>
      <section className="grid">
        <div className="stack">
          <TermForm onSubmit={handleTermSubmit} loading={loadingTerm} />
          {error && <div className="pill error">{error}</div>}
          {hasSeries && (
            <div className="panel stats">
              <div>
                <p className="eyebrow">Current selection</p>
                <h3>{selectedTerm}</h3>
              </div>
              <div className="stat">
                <p className="eyebrow">Start</p>
                <p className="big-number">{termSeries?.startValue.toFixed(2)}</p>
              </div>
              <div className="stat">
                <p className="eyebrow">Latest</p>
                <p className="big-number">{termSeries?.endValue.toFixed(2)}</p>
              </div>
              <div className="stat">
                <p className="eyebrow">Growth</p>
                <p className="big-number accent">{termSeries?.growthPercentage.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </div>

        <div className="stack">
          <GrowthTable rows={leaderboard} loading={loadingBoard} />
        </div>
      </section>

      <section className="stack">
        <TrendChart term={selectedTerm} series={hasSeries ? termSeries!.series : []} />
      </section>
    </Layout>
  );
};

export default Home;