import React, { useEffect, useState } from 'react';

function TypingIndicator() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            fontStyle: 'italic',
            backgroundColor: '#fdecea',
            padding: '1rem',
            borderRadius: '8px',
            alignSelf: 'flex-start',
            maxWidth: '85%',
        }}>
            Copilot is typing{dots}
        </div>
    );
}

export default TypingIndicator;
