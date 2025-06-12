// src/pages/SignUp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { saveUserProfile } from '../utils/firebaseUtils';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            // Step 1: Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 2: Create initial profile in Firestore
            const profileData = {
                firstName: '',
                lastName: '',
                preferredName: '',
                personality: '',
                copilotStyle: '',
                interests: [],
                avatarUrl: '',  // you can also add this
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await saveUserProfile(user.uid, profileData);

            // Step 3: Clear form and redirect to Welcome page
            setEmail('');
            setPassword('');
            setError('');
            navigate('/welcome');  // 🚀 FIXED: proper first page after signup
        } catch (err) {
            console.error('Signup failed:', err);
            setError(err.message.split(':').pop().trim());
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Sign Up</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: 'block', marginBottom: '1rem' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', marginBottom: '1rem' }}
            />
            <button onClick={handleSignup}>Create Account</button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
}

export default SignUp;
