import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            setError('');
            navigate('/dashboard');
        } catch (err) {
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
