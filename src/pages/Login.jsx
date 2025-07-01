// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, FormControl, FormLabel, Input, Heading, Text, Alert, AlertIcon, VStack
} from '@chakra-ui/react';
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
        <Box maxW="400px" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <Heading mb={6} textAlign="center">Login</Heading>
            <VStack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </FormControl>

                <Button colorScheme="teal" width="100%" onClick={handleLogin}>
                    Login
                </Button>

                {error && (
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                <Text fontSize="sm" color="gray.500">
                    Don't have an account? <Button variant="link" colorScheme="teal" onClick={() => navigate('/signup')}>Sign up</Button>
                </Text>
            </VStack>
        </Box>
    );
}

export default Login;
