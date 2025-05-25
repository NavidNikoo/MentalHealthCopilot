import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';
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
        window.location.href = '/login';
    };

    return (
        <Flex direction="column" w="100vw" h="100vh">
            <Box
                as="nav"
                display="flex"
                gap="1rem"
                p="1rem"
                bg="gray.100"
                borderBottom="1px solid #ccc"
            >
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/journal">Journal</Link>
                        <Link to="/copilot">Copilot Chat</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Button size="sm" colorScheme="gray" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </Box>

            <Box flex="1" h="100%" w="100%">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
                    <Route path="/copilot" element={<PrivateRoute><CopilotChat /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                </Routes>
            </Box>
        </Flex>
    );
}

export default function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}
