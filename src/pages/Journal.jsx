import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    GridItem,
    Text,
    Textarea,
    useColorModeValue,
} from '@chakra-ui/react';
import MoodSelector from '../components/MoodSelector';
import {
    saveJournalEntry,
    listenToJournalEntries,
} from '../utils/firebaseUtils';
import { auth } from '../firebase';

function Journal() {
    const [mood, setMood] = useState(null);
    const [note, setNote] = useState('');
    const [logs, setLogs] = useState([]);
    const [awaitingReflection, setAwaitingReflection] = useState(false);
    const [copilotResponse, setCopilotResponse] = useState('');
    const [latestIndex, setLatestIndex] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            // Fetch entries once and combine with localStorage if needed
            listenToJournalEntries(user.uid, (entries) => {
                // Merge entries with localStorage data to preserve reflection
                const localLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];

                // Prevent duplicates by matching on date + note
                const merged = [...entries];

                localLogs.forEach((localEntry) => {
                    const exists = merged.find(
                        (e) => e.date === localEntry.date && e.note === localEntry.note
                    );
                    if (!exists) merged.push(localEntry);
                });

                setLogs(merged);
            });
        } else {
            const savedLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
            setLogs(savedLogs);
        }
    }, []);



    const handleSubmit = async () => {
        if (!mood) {
            alert('Please select a mood.');
            return;
        }

        const newEntry = {
            date: new Date().toISOString().split('T')[0],
            label: mood.label,
            value: mood.value,
            color: mood.color,
            note,
            reflection: '',
        };

        const updatedLogs = [...logs, newEntry];
        localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
        setLogs(updatedLogs);
        setLatestIndex(updatedLogs.length - 1);
        setMood(null);
        setNote('');
        setCopilotResponse(''); // ✅ clear previous reflection display
        setAwaitingReflection(true);

        if (auth.currentUser) {
            await saveJournalEntry(auth.currentUser.uid, newEntry);
        }
    };


    const handleReflection = async () => {
        const moodLabel = logs[latestIndex]?.label || '';
        const userNote = logs[latestIndex]?.note || '';

        const prompt = `The user clearly expressed the mood "${moodLabel}" and wrote the following journal note: "${userNote}". Based on this, write a brief, emotionally intelligent reflection that validates what they’re feeling and gently helps them explore it further.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a supportive journaling assistant.' },
                    { role: 'user', content: prompt },
                ],
            }),
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Something went wrong.';
        setCopilotResponse('');
        setAwaitingReflection(false);

        const updatedLogs = [...logs];
        updatedLogs[latestIndex].reflection = reply;
        localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
        setLogs(updatedLogs);
    };


    return (
        <Box p={6}>
            <MoodSelector onSelect={setMood} />

            {mood && (
                <Box mt={6}>
                    <Textarea
                        placeholder="Want to add a note?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                    />
                    <Button onClick={handleSubmit} mt={4} colorScheme="teal">
                        Save Mood
                    </Button>
                </Box>
            )}

            {awaitingReflection && (
                <Box mt={6}>
                    <Text mb={2}>Would you like a reflection from your Copilot?</Text>
                    <Button onClick={handleReflection} colorScheme="blue">
                        Get Reflection
                    </Button>
                </Box>
            )}

            {logs.length > 0 && (
                <Box mt={10}>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                        Your Mood Journal
                    </Text>
                    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
                        {logs.map((entry, index) => (
                            <GridItem
                                key={index}
                                p={4}
                                bg="white"
                                borderRadius="md"
                                boxShadow="md"
                                border="1px solid"
                                borderColor={useColorModeValue('gray.200', 'gray.700')}
                            >
                                <Text fontWeight="bold">{entry.date}</Text>
                                <Text>Mood: {entry.label}</Text>
                                <Text mt={2} fontStyle="italic">
                                    {entry.note || 'No note'}
                                </Text>
                                {entry.reflection && (
                                    <Box mt={3}>
                                        <Text fontWeight="semibold">Reflection:</Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {entry.reflection}
                                        </Text>
                                    </Box>
                                )}
                            </GridItem>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}

export default Journal;
