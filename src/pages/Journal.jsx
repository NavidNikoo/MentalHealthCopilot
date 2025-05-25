import { useState, useEffect } from 'react';
import MoodSelector from '../components/MoodSelector';
import JournalBook from '../components/JournalBook';
import {
    saveJournalEntry,
    listenToJournalEntries
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
        let unsubscribe;

        if (user) {
            unsubscribe = listenToJournalEntries(user.uid, (entries) => {
                setLogs(entries);
            });
        } else {
            const savedLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
            setLogs(savedLogs);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
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
            reflection: ''
        };

        const updatedLogs = [...logs, newEntry];
        localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
        setLogs(updatedLogs);
        setLatestIndex(updatedLogs.length - 1);
        setMood(null);
        setNote('');
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
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a supportive journaling assistant.' },
                    { role: 'user', content: prompt }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Something went wrong.';
        setCopilotResponse(reply);
        setAwaitingReflection(false);

        const updatedLogs = [...logs];
        updatedLogs[latestIndex].reflection = reply;
        localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
        setLogs(updatedLogs);

        if (auth.currentUser) {
            await saveJournalEntry(auth.currentUser.uid, updatedLogs[latestIndex]);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <MoodSelector onSelect={setMood} />

            {mood && (
                <div style={{ marginTop: '2rem' }}>
                    <textarea
                        placeholder="Want to add a note?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        style={{ width: '100%', height: '100px', padding: '1rem' }}
                    />
                    <button onClick={handleSubmit} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                        Save Mood
                    </button>
                </div>
            )}

            {awaitingReflection && (
                <div style={{ marginTop: '2rem' }}>
                    <p>Would you like a reflection from your Copilot?</p>
                    <button onClick={handleReflection}>Get Reflection</button>
                </div>
            )}

            {copilotResponse && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#eef2f7',
                    borderRadius: '8px'
                }}>
                    <strong>Copilot:</strong>
                    <p>{copilotResponse}</p>
                    <button
                        onClick={async () => {
                            const updated = [...logs];
                            updated[latestIndex].reflection = copilotResponse;
                            localStorage.setItem('moodLogs', JSON.stringify(updated));
                            setLogs(updated);
                            setCopilotResponse('');
                            alert('Reflection saved!');
                            if (auth.currentUser) {
                                await saveJournalEntry(auth.currentUser.uid, updated[latestIndex]);
                            }
                        }}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px' }}
                    >
                        Save Reflection
                    </button>
                </div>
            )}

            {logs.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                    <h2>Your Mood Journal</h2>
                    <JournalBook entries={logs} />
                </div>
            )}
        </div>
    );
}

export default Journal;
