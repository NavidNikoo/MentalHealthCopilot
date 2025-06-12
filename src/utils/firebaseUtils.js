import { collection, addDoc, setDoc, getDocs, getDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';



export const saveJournalEntry = async (uid, entry) => {
    const userCollection = collection(db, 'users', uid, 'journalEntries');

    if (entry.id) {
        const entryRef = doc(userCollection, entry.id);
        const { id, ...data } = entry; // exclude `id` from saved data
        await setDoc(entryRef, data, { merge: true });
        return entry.id;
    } else {
        const docRef = await addDoc(userCollection, entry);
        return docRef.id; // ⬅️ return the generated ID so the caller can save it
    }
};

export async function fetchJournalEntries(uid) {
    const userEntriesRef = collection(db, 'users', uid, 'journalEntries');
    const snapshot = await getDocs(userEntriesRef);
    return snapshot.docs.map(doc => doc.data());
}

export function listenToJournalEntries(uid, onUpdate) {
    const q = query(collection(db, 'users', uid, 'journalEntries'));
    return onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(docSnap => ({
            id: docSnap.id,  // 🚀 include Firestore document ID!
            ...docSnap.data(),
        }));
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

export const deleteJournalEntry = async (uid, entryId) => {
    const entryRef = doc(db, 'users', uid, 'journalEntries', entryId);
    await deleteDoc(entryRef);
};

// Save User Profile
export async function saveUserProfile(uid, profileData) {
    const profileRef = doc(db, 'users', uid, 'profile', 'main');  // ✅ FIXED
    await setDoc(profileRef, profileData);
}

// Fetch User Profile
export async function fetchUserProfile(uid) {
    const profileRef = doc(db, 'users', uid, 'profile', 'main');  // ✅ FIXED
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
        return profileSnap.data();
    } else {
        return null;
    }
}
