import MoodChart from '../components/MoodChart';
import MoodBreakdown from '../components/MoodBreakdown';
import { useLogs } from '../context/LogsContext';
import { Box, Flex, Heading, Button, Text, Divider } from '@chakra-ui/react';

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
    const { logs, setLogs } = useLogs();

    const handleReset = () => {
        localStorage.removeItem('moodLogs');
        setLogs([]);
    };

    const { current, max } = calculateStreaks(logs);

    return (
        <Box p={8}>
            <Heading mb={4}>Dashboard</Heading>

            <Flex align="center" justify="space-between" mb={6}>
                <Box>
                    <Text fontSize="lg" fontWeight="bold">Current Streak: {current} day{current !== 1 ? 's' : ''}</Text>
                    <Text fontSize="lg" fontWeight="bold">Longest Streak: {max} day{max !== 1 ? 's' : ''}</Text>
                </Box>
                <Button colorScheme="red" onClick={handleReset}>
                    Reset Mood History
                </Button>
            </Flex>

            <Divider mb={6} />

            <Box mb={10}>
                <Heading size="md" mb={4}>Mood History</Heading>
                <MoodChart logs={logs} />
            </Box>

            <Divider mb={6} />

            <Box>
                <Heading size="md" mb={4}>Mood Breakdown</Heading>
                <MoodBreakdown logs={logs} />
            </Box>
        </Box>
    );
}

export default Dashboard;
