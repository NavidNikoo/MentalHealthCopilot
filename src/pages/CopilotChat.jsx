import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CopilotChat.css';

function CopilotChat() {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('copilotMessages');
        return saved ? JSON.parse(saved) : [];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // ✅ Load saved messages on mount
    useEffect(() => {
        const saved = localStorage.getItem('copilotMessages');
        if (saved) {
            setMessages(JSON.parse(saved));
        }
    }, []);

    // ✅ Save messages on update
    useEffect(() => {
        localStorage.setItem('copilotMessages', JSON.stringify(messages));
    }, [messages]);

    // ✅ Auto-scroll to latest message
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

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
                        { role: 'system', content: 'You are a supportive mental health copilot.' },
                        ...newMessages
                    ]
                })
            });

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || "Hmm, I’m not sure how to respond to that.";

            setMessages([...newMessages, { role: 'assistant', content: reply }]);
        } catch (err) {
            setMessages([...newMessages, { role: 'assistant', content: 'Error reaching AI. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="copilot-container">
            <h2 className="copilot-title">Talk to your Copilot</h2>

            <div className="chat-box">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className={`message ${msg.role}`}
                        >
                            <strong>{msg.role === 'user' ? 'You' : 'Copilot'}:</strong> {msg.content}
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="message assistant"
                        >
                            <em>Copilot is typing...</em>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Say what's on your mind..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default CopilotChat;
