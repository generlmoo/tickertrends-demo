import React from 'react';
import { LeaderboardRow } from '../types';

interface Props {
    rows: LeaderboardRow[];
    loading?: boolean;
}

const GrowthTable: React.FC<Props> = ({ rows, loading }) => {
    const sorted = [...rows].sort((a, b) => b.growthPercentage - a.growthPercentage);

    return (
        <div className="panel growth-table">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Exploding terms</p>
                    <h2>Growth leaderboard</h2>
                </div>
                {loading && <span className="pill">Refreshing…</span>}
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Term</th>
                            <th>Start</th>
                            <th>Latest</th>
                            <th>Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((row) => (
                            <tr key={row.term}>
                                <td className="term-col">{row.term}</td>
                                <td>{row.startValue.toFixed(2)}</td>
                                <td>{row.endValue.toFixed(2)}</td>
                                <td className="growth">{row.growthPercentage.toFixed(2)}%</td>
                            </tr>
                        ))}
                        {!sorted.length && !loading && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: '#8aa6c4' }}>
                                    No terms stored yet. Add one above to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GrowthTable;