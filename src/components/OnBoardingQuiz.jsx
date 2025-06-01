import { useState } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';


const moodLabels = {
    1: 'Very Sad',
    2: 'Sad',
    3: 'Neutral',
    4: 'Happy',
    5: 'Very Happy',
};

export default function OnboardingQuiz({ onComplete }) {
    const uid = auth.currentUser.uid;
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        name: '',
        age: '',
        sport: '',
        mood: 3,
    });

    const steps = [
        { key: 'name', label: 'What’s your name?' },
        { key: 'age', label: 'How old are you?' },
        { key: 'sport', label: 'What’s your favorite sport or activity?' },
        { key: 'mood', label: 'How are you feeling today?', type: 'mood' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers((a) => ({ ...a, [name]: value }));
    };

    const handleNext = async () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // final step: write to Firestore
            const profileRef = doc(db, 'users', uid, 'profile', 'info');
            await setDoc(profileRef, {
                name: answers.name,
                age: Number(answers.age),
                sport: answers.sport,
            });
            // log today's mood
            const moodLogRef = collection(db, 'users', uid, 'moodLogs');
            await addDoc(moodLogRef, {
                mood: Number(answers.mood),
                label: moodLabels[answers.mood],
                createdAt: serverTimestamp(),
            });
            onComplete({ ...answers, moodLabel: moodLabels[answers.mood] });
        }
    };

    const { key, label, type } = steps[step];


    return (
        <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
            <h2>{label}</h2>
            {type === 'mood' ? (
                <div>
                    <input
                        type="range"
                        name="mood"
                        min="1"
                        max="5"
                        value={answers.mood}
                        onChange={handleChange}
                    />
                    <p style={{ textAlign: 'center' }}>
                        {moodLabels[answers.mood]}
                    </p>
                </div>
            ) : (
                <input
                    name={key}
                    value={answers[key]}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                />
            )}
            <button
                onClick={handleNext}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
            >
                {step < steps.length - 1 ? 'Next' : 'Finish'}
            </button>
        </div>
    );
}
