import React, { useState } from 'react';

interface Props {
    onSubmit: (term: string) => void;
    loading?: boolean;
}

const TermForm: React.FC<Props> = ({ onSubmit, loading }) => {
    const [term, setTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!term.trim()) return;
        onSubmit(term.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="panel term-form">
            <label className="field-label" htmlFor="term">
                Track a new keyword
            </label>
            <div className="term-input-row">
                <input
                    id="term"
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="e.g. crocs, tesla, bitcoin"
                    className="term-input"
                />
                <button type="submit" className="term-submit" disabled={loading}>
                    {loading ? 'Fetching…' : 'Capture'}
                </button>
            </div>
        </form>
    );
};

export default TermForm;