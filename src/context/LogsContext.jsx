// src/context/LogsContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { listenToJournalEntries } from '../utils/firebaseUtils';
import { auth } from '../firebase';

const LogsContext = createContext();

export function LogsProvider({ children }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            listenToJournalEntries(user.uid, (entries) => {
                setLogs(entries);
            });
        } else {
            const savedLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
            setLogs(savedLogs);
        }
    }, []);

    return (
        <LogsContext.Provider value={{ logs, setLogs }}>
            {children}
        </LogsContext.Provider>
    );
}

export function useLogs() {
    return useContext(LogsContext);
}
