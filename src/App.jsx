// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Journal from './pages/Journal';
import CopilotChat from './pages/CopilotChat';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
    return (
        <Router>
            <nav style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                background: '#f5f5f5',
                borderBottom: '1px solid #ccc'
            }}>
                <Link to="/">Home</Link>
                <Link to="/journal">Journal</Link>
                <Link to="/copilot">Copilot Chat</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
            </nav>

            <main style={{ padding: '2rem' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/copilot" element={<CopilotChat />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
