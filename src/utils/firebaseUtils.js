import { collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';


export async function saveJournalEntry(uid, entry) {
    try {
        const userEntriesRef = collection(db, 'users', uid, 'journalEntries');
        await addDoc(userEntriesRef, entry);
        console.log('✅ Entry saved to Firestore');
    } catch (error) {
        console.error('❌ Failed to save entry:', error);
    }
}

export async function fetchJournalEntries(uid) {
    const userEntriesRef = collection(db, 'users', uid, 'journalEntries');
    const snapshot = await getDocs(userEntriesRef);
    return snapshot.docs.map(doc => doc.data());
}

export function listenToJournalEntries(uid, onUpdate) {
    const q = query(collection(db, 'users', uid, 'journalEntries'));
    return onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(doc => doc.data());
        onUpdate(entries);
    });
}

export async function saveChatMessage(uid, message) {
    const ref = collection(db, 'users', uid, 'copilotMessages');
    await addDoc(ref, {
        ...message,
        timestamp: new Date()
    });
}

export async function fetchChatMessages(uid) {
    const q = query(collection(db, 'users', uid, 'copilotMessages'), orderBy('timestamp'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}


export async function fetchChats(uid) {
    const chatsRef = collection(db, 'users', uid, 'chats');
    const snapshot = await getDocs(query(chatsRef, orderBy('createdAt')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveChatMessageToSession(uid, chatId, message) {
    const messagesRef = collection(db, 'users', uid, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
        ...message,
        timestamp: new Date()
    });
}

export async function fetchChatMessagesById(uid, chatId) {
    const messagesRef = collection(db, 'users', uid, 'chats', chatId, 'messages');
    const snapshot = await getDocs(query(messagesRef, orderBy('timestamp')));
    return snapshot.docs.map(doc => doc.data());
}

// Rename chat
export async function renameChat(uid, chatId, newTitle) {
    const chatRef = doc(db, 'users', uid, 'chats', chatId);
    await updateDoc(chatRef, { title: newTitle });
}

// Delete chat and all its messages
export async function deleteChat(uid, chatId) {
    const messagesRef = collection(db, 'users', uid, 'chats', chatId, 'messages');
    const messagesSnap = await getDocs(messagesRef);
    await Promise.all(messagesSnap.docs.map(docSnap => deleteDoc(docSnap.ref)));

    const chatRef = doc(db, 'users', uid, 'chats', chatId);
    await deleteDoc(chatRef);
}

// Real-time chat sync
export function listenToChats(uid, onUpdate) {
    const q = query(collection(db, 'users', uid, 'chats'), orderBy('createdAt'));
    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        onUpdate(chats);
    });
}

export async function createChatSession(uid, title, characterId = null) {
    const chatRef = await addDoc(collection(db, `users/${uid}/chats`), {
        title,
        createdAt: serverTimestamp(),
        characterId, // 🔥 add this
    });
    return chatRef.id;
}
