import {
    Box,
    Flex,
    Heading,
    Button,
    Text,
    Divider,
    Spinner,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MoodChart from '../components/MoodChart';
import MoodBreakdown from '../components/MoodBreakdown';
import { useLogs } from '../context/LogsContext';

function calculateStreaks(logs) {
    if (!logs.length) return { current: 0, max: 0 };

    const dateSet = new Set(logs.map(entry => entry.date));
    const dates = Array.from(dateSet).map(dateStr => new Date(dateStr)).sort((a, b) => a - b);

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
    const [summary, setSummary] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);

    const handleReset = () => {
        localStorage.removeItem('moodLogs');
        setLogs([]);
    };

    const { current, max } = calculateStreaks(logs);

    const flattenedLogs = logs.flatMap(entry => {
        if (entry.moods && Array.isArray(entry.moods)) {
            return entry.moods.map(mood => ({
                date: entry.date,
                label: mood.label,
                value: mood.value,
                color: mood.color
            }));
        } else {
            return [{
                date: entry.date,
                label: entry.label,
                value: entry.value,
                color: entry.color
            }];
        }
    });

    useEffect(() => {
        if (flattenedLogs.length === 0) {
            setSummary('No data to summarize.');
            return;
        }

        const fetchSummary = async () => {
            setLoadingSummary(true);

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a compassionate mental health assistant. Analyze the mood logs and offer the user an encouraging and insightful 3–4 sentence summary. Reference trends (positive or negative), emotional diversity, and suggest one small action if needed.'
                            },
                            {
                                role: 'user',
                                content: `Here are my mood logs:\n${flattenedLogs.map(log => `${log.date}: ${log.label} (${log.value})`).join('\n')}`
                            }
                        ],
                        temperature: 0.7
                    })
                });

                if (!response.ok) throw new Error('API request failed');
                const result = await response.json();
                setSummary(result.choices[0].message.content);
            } catch (err) {
                console.error('Error fetching summary:', err);
                setSummary('Could not generate summary. Try again later.');
            } finally {
                setLoadingSummary(false);
            }
        };

        fetchSummary();
    }, [logs]);

    return (
        <Box p={8} bg={useColorModeValue('gray.50', 'gray.900')}>
            <VStack spacing={10} align="stretch">
                <Box>
                    <Heading size="xl" mb={2}>Dashboard</Heading>
                    <Text fontSize="md" color="gray.600">Track your emotional trends, reflect, and grow.</Text>
                </Box>

                <Flex justify="space-between" align="center" wrap="wrap">
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">
                            🌱 Current Streak: {current} day{current !== 1 ? 's' : ''}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold">
                            🔥 Longest Streak: {max} day{max !== 1 ? 's' : ''}
                        </Text>
                    </Box>
                    <Button colorScheme="red" onClick={handleReset} mt={{ base: 4, md: 0 }}>
                        Reset Mood History
                    </Button>
                </Flex>

                <Divider />

                <Box>
                    <Heading size="md" mb={4}>📈 Mood History</Heading>
                    <MoodChart logs={flattenedLogs} />
                </Box>

                <Divider />

                <Box>
                    <Heading size="md" mb={4}>🔍 Mood Breakdown</Heading>
                    <MoodBreakdown logs={flattenedLogs} />
                </Box>

                <Divider />

                <Box>
                    <Heading size="md" mb={4}>🧠 AI Mood Summary</Heading>
                    {loadingSummary ? (
                        <Spinner size="lg" />
                    ) : (
                        <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
                            {summary}
                        </Text>
                    )}
                </Box>
            </VStack>
        </Box>
    );
}

export default Dashboard;
