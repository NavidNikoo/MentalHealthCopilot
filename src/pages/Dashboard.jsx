import MoodChart from '../components/MoodChart';
import MoodBreakdown from '../components/MoodBreakdown';
import { useState, useEffect } from 'react';

function calculateStreaks(logs) {
    if (!logs.length) return { current: 0, max: 0 };

    const dates = logs.map(entry => new Date(entry.date)).sort((a, b) => a - b);
    let current = 1, max = 1;

    for (let i = 1; i < dates.length; i++) {
        const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
            current += 1;
            max = Math.max(max, current);
        } else if (diff > 1) {
            current = 1;
        }
    }

    const lastEntry = dates[dates.length - 1];
    const today = new Date();
    const daysSinceLast = Math.floor((today - lastEntry) / (1000 * 60 * 60 * 24));
    const currentStreak = daysSinceLast === 0 ? current : 0;

    return { current: currentStreak, max };
}


function Dashboard() {
    const [resetTrigger, setResetTrigger] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const savedLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
        setLogs(savedLogs);
    }, [resetTrigger]);

    const handleReset = () => {
        localStorage.removeItem('moodLogs');
        setResetTrigger(!resetTrigger); // triggers re-render
    };

    const { current, max } = calculateStreaks(logs);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>

            <div style={{ marginBottom: '1rem' }}>
                <p><strong>Current Streak:</strong> {current} day{current !== 1 ? 's' : ''}</p>
                <p><strong>Longest Streak:</strong> {max} day{max !== 1 ? 's' : ''}</p>
            </div>

            <button
                onClick={handleReset}
                style={{
                    marginBottom: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Reset Mood History
            </button>

            <MoodChart key={resetTrigger} />
            <MoodBreakdown logs={logs} />
        </div>
    );

}


export default Dashboard;
