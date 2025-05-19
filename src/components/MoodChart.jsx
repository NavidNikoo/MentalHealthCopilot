import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function MoodChart() {
    const logs = JSON.parse(localStorage.getItem('moodLogs')) || [];

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
        'Fear/Grief/Powerlessness'
    ];


    const data = {
        labels: logs.map(log => log.date),
        datasets: [
            {
                label: 'Mood Trend',
                data: logs.map(log => log.value),
                fill: false,
                borderColor: '#4bc0c0',
                tension: 0.2,
                pointRadius: 5
            }
        ]
    };

    const options = {
        scales: {
            y: {
                min: 1,
                max: 20,
                ticks: {
                    stepSize: 1,
                    callback: (value) => moodLabels[value - 1] || ''
                }
            }
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '700px', margin: '2rem auto' }}>
            <h2>Mood History</h2>
            <Line data={data} options={options} />
        </div>
    );
}

export default MoodChart;
