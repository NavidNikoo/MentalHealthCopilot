import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { saveChatMessageToSession } from '../utils/firebaseUtils';
import { db } from '../firebase';
import characters from '../data/characters';
import './CharacterSelect.css';

function CharacterSelect({ onChoose, auth, activeChatId, setCharacter, setMessages, messages }) {
    const handleSelect = async (char) => {
        if (!auth.currentUser || !activeChatId) return;

        const chatRef = doc(db, 'users', auth.currentUser.uid, 'chats', activeChatId);
        await updateDoc(chatRef, { characterId: char.id });
        setCharacter(char);

        if (messages.length === 0) {
            const welcomeMessage = {
                role: 'assistant',
                content: char.welcomeMessage || `Hi, I'm ${char.name}, your ${char.role.toLowerCase()}. How can I support you today?`,
                characterId: char.id,
                characterName: char.name
            };
            await saveChatMessageToSession(auth.currentUser.uid, activeChatId, welcomeMessage);
            setMessages([welcomeMessage]);
        }

        if (onChoose) {
            onChoose(char);
        }
    };

    return (
        <div className="character-select-container">
            <h2 className="character-heading">Choose Your Copilot</h2>
            <div className="character-grid">
                {characters.map((char) => (
                    <div
                        key={char.id}
                        className="character-card"
                        onClick={() => handleSelect(char)}
                        style={{
                            '--hover-color': `${char.color}20`
                        }}
                    >
                        <img src={char.avatar} alt={char.name} className="character-avatar" />
                        <h3>{char.name}</h3>
                        <p className="character-role">{char.role}</p>
                        <p className="character-bio">{char.bio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CharacterSelect;
