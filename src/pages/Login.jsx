import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
            <h2>Login</h2>
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
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
}

export default Login;
