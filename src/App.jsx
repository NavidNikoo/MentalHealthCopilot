// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Journal from './pages/Journal';
import CopilotChat from './pages/CopilotChat';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function AppRoutes() {
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = '/login'; // fallback method to redirect after logout
    };

    return (
        <>
            <nav style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                background: '#f5f5f5',
                borderBottom: '1px solid #ccc'
            }}>
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/journal">Journal</Link>
                        <Link to="/copilot">Copilot Chat</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </nav>

            <main style={{ padding: '2rem' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
                    <Route path="/copilot" element={<PrivateRoute><CopilotChat /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                </Routes>
            </main>
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}
