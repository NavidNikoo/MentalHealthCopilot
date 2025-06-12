// src/components/MoodChart.jsx

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { useLogs } from '../context/LogsContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function MoodChart() {
    const { logs } = useLogs();

    if (logs.length === 0) {
        return <p style={{ textAlign: 'center' }}>No mood data logged yet.</p>;
    }

    const moodLabels = [
        'Joy/Appreciation/Love',
        'Passion',
        'Enthusiasm/Eagerness',
        'Optimism',
        'Hopefulness',
        'Contentment',
        'Boredom',
        'Pessimism',
        'Frustration/Impatience',
        'Overwhelm',
        'Disappointment',
        'Doubt',
        'Worry',
        'Blame',
        'Discouragement',
        'Anger/Revenge',
        'Hatred/Rage',
        'Jealousy',
        'Insecurity/Guilt',
        'Fear/Grief/Powerlessness',
    ];

    // NEW → Compute average mood value per day
    const dates = logs.map(log =>
        new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    const averageMoodPerDay = logs.map(log => {
        if (Array.isArray(log.moods) && log.moods.length > 0) {
            const sum = log.moods.reduce((acc, mood) => acc + mood.value, 0);
            const avg = sum / log.moods.length;
            return avg.toFixed(2);
        } else {
            return null; // No moods
        }
    });

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Mood Trend',
                data: averageMoodPerDay,
                fill: false,
                borderColor: '#4bc0c0',
                tension: 0.3,
                pointRadius: 5,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                min: 1,
                max: 20,
                ticks: {
                    stepSize: 1,
                    callback: value => moodLabels[value - 1] || '',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '2rem auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Mood History</h2>
            <Line data={data} options={options} />
        </div>
    );
}

export default MoodChart;
