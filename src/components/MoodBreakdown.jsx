// src/components/MoodBreakdown.jsx
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function MoodBreakdown({ logs }) {
    const moodCounts = {};
    let moodSum = 0;

    logs.forEach(log => {
        moodCounts[log.label] = (moodCounts[log.label] || 0) + 1;
        moodSum += log.value;
    });

    const avgMood = logs.length ? (moodSum / logs.length).toFixed(2) : 'N/A';

    const labels = Object.keys(moodCounts);
    const data = Object.values(moodCounts);

    const pieData = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: labels.map((_, i) => `hsl(${i * 35}, 70%, 60%)`),
                borderWidth: 1
            }
        ]
    };

    const barData = {
        labels,
        datasets: [
            {
                label: 'Frequency',
                data,
                backgroundColor: '#4bc0c0'
            }
        ]
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3>Average Mood Score: {avgMood}</h3>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                    <h4>Mood Distribution</h4>
                    <Pie data={pieData} />
                </div>
                <div style={{ flex: 1 }}>
                    <h4>Most Frequent Moods</h4>
                    <Bar data={barData} />
                </div>
            </div>
        </div>
    );
}

export default MoodBreakdown;
