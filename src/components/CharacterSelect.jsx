import React, { useRef, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { saveChatMessageToSession } from '../utils/firebaseUtils';
import { db } from '../firebase';
import characters from '../data/characters';
import './CharacterSelect.css';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useDisclosure
} from '@chakra-ui/react';

function CharacterSelect({ onChoose, auth, activeChatId, isPremium }) {
    const freeCharacters = ['brett', 'britney'];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [lockedCharacter, setLockedCharacter] = useState(null);

    const handleSelect = async (char) => {
        const isLocked = !isPremium && !freeCharacters.includes(char.id.toLowerCase());
        if (isLocked) {
            setLockedCharacter(char);
            onOpen();
            return;
        }

        if (!auth.currentUser || !activeChatId) return;

        const chatRef = doc(db, 'users', auth.currentUser.uid, 'chats', activeChatId);
        await updateDoc(chatRef, { characterId: char.id });

        // Save welcome message
        const welcomeMessage = {
            role: 'assistant',
            content: char.welcomeMessage || `Hi, I'm ${char.name}, your ${char.role.toLowerCase()}. How can I support you today?`,
            characterId: char.id,
            characterName: char.name
        };
        await saveChatMessageToSession(auth.currentUser.uid, activeChatId, welcomeMessage);

        // ✅ Trigger UI immediately
        onChoose?.(char, [welcomeMessage]);
    };

    return (
        <>
            <div className="character-select-container">
                <h2 className="character-heading">Choose Your Copilot</h2>
                <div className="character-grid">
                    {characters.map((char) => {
                        const isLocked = !isPremium && !freeCharacters.includes(char.id.toLowerCase());

                        return (
                            <div
                                key={char.id}
                                className={`character-card ${isLocked ? 'locked' : ''}`}
                                onClick={() => handleSelect(char)}
                                style={{ '--hover-color': `${char.color}20`, opacity: isLocked ? 0.5 : 1 }}
                            >
                                <img src={char.avatar} alt={char.name} className="character-avatar" />
                                <h3>{char.name}</h3>
                                <p className="character-role">{char.role}</p>
                                <p className="character-bio">{char.bio}</p>
                                {isLocked && (
                                    <p className="character-locked">🔒 Premium Only</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Premium Character Locked
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {lockedCharacter?.name} is available to Premium members only.
                            Upgrade to unlock all copilots and exclusive features.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="teal"
                                onClick={() => {
                                    onClose();
                                    window.location.href = '/profile';
                                }}
                                ml={3}
                            >
                                Upgrade Now
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default CharacterSelect;
