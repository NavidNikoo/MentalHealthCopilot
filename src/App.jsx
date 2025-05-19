import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Journal from './pages/Journal';
import CopilotChat from './pages/CopilotChat';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/journal">Journal</Link>
                <Link to="/copilot">Copilot Chat</Link>
                <Link to="/dashboard">Dashboard</Link>
            </nav>

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/copilot" element={<CopilotChat />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
