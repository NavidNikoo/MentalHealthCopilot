import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    createChatSession,
    fetchChatMessagesById,
    saveChatMessageToSession,
    renameChat,
    deleteChat,
    listenToChats,
} from '../utils/firebaseUtils';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import CharacterSelect from '../components/CharacterSelect';
import characters from '../data/characters';
import TypingIndicator from '../components/TypingIndicator';
import './CopilotChat.css';
import CharacterHeader from '../components/CharacterHeader';
import ReactMarkdown from 'react-markdown';
import { Avatar } from '@chakra-ui/react';  // ✅ added
import { useProfile } from '../hooks/useProfile';


function CopilotChat() {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(() => localStorage.getItem('lastChatId') || null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [character, setCharacter] = useState(null);
    const [loadingCharacter, setLoadingCharacter] = useState(false);
    const { profile, isPremium } = useProfile();


    const scrollRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (!auth.currentUser) return;
        const unsub = listenToChats(auth.currentUser.uid, setChats);
        return () => unsub && unsub();
    }, []);

    useEffect(() => {
        if (!auth.currentUser || !activeChatId) return;

        localStorage.setItem('lastChatId', activeChatId);
        setLoadingCharacter(true);

        (async () => {
            try {
                const chatRef = doc(db, 'users', auth.currentUser.uid, 'chats', activeChatId);
                const chatDoc = await getDoc(chatRef);

                if (chatDoc.exists()) {
                    const data = chatDoc.data();
                    const savedCharacterId = data.characterId;
                    const foundCharacter = characters.find(c => c.id === savedCharacterId);
                    setCharacter(foundCharacter || null);
                } else {
                    setCharacter(null);
                }

                const msgs = await fetchChatMessagesById(auth.currentUser.uid, activeChatId);
                setMessages(msgs);
            } catch (e) {
                console.error('Error fetching chat data:', e);
                setCharacter(null);
                setMessages([]);
            } finally {
                setLoadingCharacter(false);
            }
        })();
    }, [activeChatId]);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    }, [messages]);

    const handleNewChat = async () => {
        if (!auth.currentUser) return;
        const newChatId = await createChatSession(auth.currentUser.uid, 'New Chat');
        setActiveChatId(newChatId);
        setMessages([]);
        setCharacter(null);
    };

    const handleRenameChat = async (chatId, newTitle) => {
        if (!auth.currentUser || !chatId || !newTitle.trim()) return;
        await renameChat(auth.currentUser.uid, chatId, newTitle.trim());
    };

    const handleDeleteChat = async (chatIdToDelete) => {
        if (!auth.currentUser) return;
        await deleteChat(auth.currentUser.uid, chatIdToDelete);
        if (chatIdToDelete === activeChatId) {
            setActiveChatId(null);
            setMessages([]);
            localStorage.removeItem('lastChatId');
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !activeChatId || !auth.currentUser || !character) return;

        const userMessage = { role: 'user', content: input };
        let updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        const isFirstUserMessage = !messages.some(msg => msg.role === 'user');
        await saveChatMessageToSession(auth.currentUser.uid, activeChatId, userMessage);

        if (isFirstUserMessage) {
            try {
                const titleRes = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: 'Generate a short 3-5 word chat title that summarizes the following user message. No punctuation.' },
                            { role: 'user', content: userMessage.content }
                        ],
                        temperature: 0.5,
                        max_tokens: 12
                    })
                });

                if (titleRes.ok) {
                    const result = await titleRes.json();
                    const aiTitle = result.choices?.[0]?.message?.content?.trim();
                    if (aiTitle) {
                        await renameChat(auth.currentUser.uid, activeChatId, aiTitle);
                    }
                }
            } catch (e) {
                console.error('Title generation failed:', e);
            }
        }

        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: character.systemPrompt },
                        ...updatedMessages
                    ]
                })
            });

            const reply = res.ok
                ? (await res.json()).choices?.[0]?.message?.content
                : 'Something went wrong with the AI response.';

            const assistantMessage = {
                role: 'assistant',
                content: reply || 'No reply from Copilot.',
                characterId: character.id
            };
            setMessages([...updatedMessages, assistantMessage]);
            await saveChatMessageToSession(auth.currentUser.uid, activeChatId, assistantMessage);
        } catch (e) {
            setMessages([...updatedMessages, { role: 'assistant', content: 'Error reaching AI. Try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100vw', overflow: 'hidden' }}>
            <Sidebar
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={setActiveChatId}
                onNewChat={handleNewChat}
                onRenameChat={handleRenameChat}
                onDeleteChat={handleDeleteChat}
                onReorderChats={setChats}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {character && (
                    <div style={{
                        position: 'sticky',
                        top: 0,
                        background: '#fff',
                        zIndex: 1000,
                        padding: '1rem 2rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}>
                        <CharacterHeader
                            character={character}
                            setCharacter={setCharacter}
                            setMessages={setMessages}
                            activeChatId={activeChatId}
                        />
                    </div>
                )}

                <div
                    ref={chatContainerRef}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1.5rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    {!loadingCharacter && !character && activeChatId && (
                        <CharacterSelect
                            auth={auth}
                            activeChatId={activeChatId}
                            isPremium={isPremium}
                            onChoose={(char, msgs) => {
                                setCharacter(() => char);
                                setMessages(() => msgs || []);
                                localStorage.setItem('lastChatId', activeChatId);  // Optional, but helps ensure state is remembered
                            }}
                        />
                    )}

                    {!loadingCharacter && character && (
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                        backgroundColor: msg.role === 'user'
                                            ? '#daf3eb'
                                            : msg.role === 'system'
                                                ? '#f0f0f0'
                                                : characters.find(c => c.id === msg.characterId)?.color || '#fdecea',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        maxWidth: '85%',
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {msg.role !== 'system' && (
                                        msg.role === 'user' ? (
                                            <Avatar
                                                size="sm"
                                                src={profile?.avatarUrl || '/default-avatar.png'}
                                                name={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
                                            />
                                        ) : (
                                            <Avatar
                                                size="sm"
                                                src={characters.find(c => c.id === msg.characterId)?.avatar || '/avatars/default.png'}
                                                name={msg.characterName || 'Copilot'}
                                            />
                                        )
                                    )}

                                    <div style={{ flex: 1 }}>
                                        {msg.role === 'system' ? (
                                            <em style={{ color: '#888' }}>{msg.content}</em>
                                        ) : (
                                            <ReactMarkdown className="markdown">
                                                {msg.content}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <motion.div
                                    key="typing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="typing-indicator"
                                >
                                    <div className="typing-avatar">💬</div>
                                    <div className="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {character && (
                    <div style={{
                        position: 'sticky',
                        bottom: 0,
                        padding: '1rem 2rem',
                        background: '#fff',
                        borderTop: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        zIndex: 1000,
                    }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSend();
                            }}
                            placeholder="Say what's on your mind..."
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '1rem',
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            style={{
                                padding: '0.75rem 1.25rem',
                                backgroundColor: '#6ec1b3',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}
                        >
                            Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CopilotChat;
