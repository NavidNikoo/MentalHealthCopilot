// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';
import Journal from './pages/Journal';
import CopilotChat from './pages/CopilotChat';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Profile from './pages/Profile';
import WelcomeQuiz from './pages/WelcomeQuiz.jsx';
import EditProfile from './pages/EditProfile';
import Landing from './pages/Landing';
import TermsOfService from './pages/TermsOfService.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import ContactUs from './pages/ContactUs.jsx';

// 👉 Add this:
import { LogsProvider } from './context/LogsContext';

function AppRoutes() {
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = '/login';
    };

    return (
        <Flex direction="column" w="100vw" h="100vh">
            {/* NEW: Use polished header */}
            <Header user={user} onLogout={handleLogout} />

            <Box flex="1" h="100%" w="100%" overflowY="auto">
                <Routes>
                    {/* Public Landing Page */}
                    <Route path="/" element={user ? <Dashboard /> : <Landing />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/contact" element={<ContactUs />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Private Routes */}
                    <Route path="/welcome" element={<PrivateRoute><WelcomeQuiz /></PrivateRoute>} />
                    <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
                    <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
                    <Route path="/copilot" element={<PrivateRoute><CopilotChat /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                </Routes>

            </Box>
        </Flex>
    );
}

export default function App() {
    return (
        <LogsProvider>  {/* 🔥 Wrap everything so Journal & Dashboard share logs */}
            <Router>
                <AppRoutes />
            </Router>
        </LogsProvider>
    );
}
