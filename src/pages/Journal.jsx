import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Text,
    useDisclosure,
} from '@chakra-ui/react';

import MoodSelector from '../components/MoodSelector';
import JournalCard from '../components/JournalCard';
import JournalEntryModal from '../components/JournalEntryModal';

import {
    saveJournalEntry,
    listenToJournalEntries,
    deleteJournalEntry
} from '../utils/firebaseUtils';
import { auth } from '../firebase';

const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substring(2);
};

function Journal() {
    const [logs, setLogs] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            setIsLoggedIn(true);
            listenToJournalEntries(user.uid, (entries) => {
                setLogs(entries);
            });
        } else {
            setIsLoggedIn(false);
            const savedLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
            setLogs(savedLogs);
        }
    }, []);

    // New Save Mood Entry
    const handleSaveMoodEntry = async (entry) => {
        const newEntry = {
            id: generateId(),
            date: new Date().toISOString().split('T')[0],
            moods: entry.moods,
            note: entry.note,
            reflection: '',
            response: '',
        };

        const updatedLogs = [...logs, newEntry];
        setLogs(updatedLogs);

        if (isLoggedIn && auth.currentUser) {
            await saveJournalEntry(auth.currentUser.uid, newEntry);
        } else {
            localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
        }
    };

    const handleReflection = async (entry) => {
        const moodLabels = entry?.moods?.map(m => m.label).join(', ') || '';
        const userNote = entry?.note || '';

        const prompt = `The user selected the moods "${moodLabels}" and wrote: "${userNote}". Write an emotionally supportive reflection.`;

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

        const updatedLogs = logs.map((log) =>
            log.id === entry.id ? { ...log, reflection: reply } : log
        );
        setLogs(updatedLogs);

        if (isLoggedIn && auth.currentUser) {
            await saveJournalEntry(auth.currentUser.uid, {
                ...entry,
                reflection: reply,
            });
        } else {
            localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
        }
    };

    const handleDeleteEntry = async (entry) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
        if (!confirmDelete) return;

        const updatedLogs = logs.filter((log) => log.id !== entry.id);
        setLogs(updatedLogs);

        if (isLoggedIn && auth.currentUser && entry.id) {
            await deleteJournalEntry(auth.currentUser.uid, entry.id);
        } else {
            localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
        }
    };

    const handleOpenModal = (entry) => {
        setSelectedEntry(entry);
        onOpen();
    };

    const handleSaveEntry = async (updatedEntry) => {
        const updatedLogs = logs.map((log) =>
            log.id === updatedEntry.id ? updatedEntry : log
        );
        setLogs(updatedLogs);

        if (isLoggedIn && auth.currentUser) {
            await saveJournalEntry(auth.currentUser.uid, updatedEntry);
        } else {
            localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
        }
    };

    return (
        <Box p={6}>
            {/* Final Clean — Only MoodSelector */}
            <MoodSelector onSave={handleSaveMoodEntry} />

            {logs.length > 0 && (
                <Box mt={10}>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                        Your Mood Journal
                    </Text>
                    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
                        {logs.map((entry) => (
                            <JournalCard
                                key={entry.id}
                                entry={entry}
                                onGetReflection={handleReflection}
                                onDelete={handleDeleteEntry}
                                onOpenModal={() => handleOpenModal(entry)}
                            />
                        ))}
                    </Grid>
                </Box>
            )}

            <JournalEntryModal
                isOpen={isOpen}
                onClose={onClose}
                entry={selectedEntry}
                onSave={handleSaveEntry}
            />
        </Box>
    );
}

export default Journal;
