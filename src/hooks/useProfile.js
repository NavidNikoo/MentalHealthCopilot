// src/hooks/useProfile.js
import { useEffect, useState, useCallback } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function useProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!auth.currentUser) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const profileRef = doc(db, 'users', auth.currentUser.uid, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
            setProfile(profileSnap.data());
        } else {
            setProfile(null);
        }

        setLoading(false);
    }, []);

    const saveProfile = async (newData) => {
        if (!auth.currentUser) return;

        const profileRef = doc(db, 'users', auth.currentUser.uid, 'profile', 'main');
        const now = new Date().toISOString();

        const profileData = {
            ...newData,
            updatedAt: now,
            createdAt: profile?.createdAt || now
        };

        await setDoc(profileRef, profileData);
        setProfile(profileData);
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        refresh: fetchProfile,
        saveProfile
    };
}

export default useProfile;