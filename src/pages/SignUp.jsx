// src/pages/SignUp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, FormControl, FormLabel, Input, Heading, Text, Alert, AlertIcon, VStack
} from '@chakra-ui/react';
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const profileData = {
                firstName: '',
                lastName: '',
                preferredName: '',
                personality: '',
                copilotStyle: '',
                interests: [],
                avatarUrl: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await saveUserProfile(user.uid, profileData);
            setEmail('');
            setPassword('');
            setError('');
            navigate('/welcome');
        } catch (err) {
            setError(err.message.split(':').pop().trim());
        }
    };

    return (
        <Box maxW="400px" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <Heading mb={6} textAlign="center">Sign Up</Heading>
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
                        placeholder="Create a password"
                    />
                </FormControl>

                <Button colorScheme="teal" width="100%" onClick={handleSignup}>
                    Create Account
                </Button>

                {error && (
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                <Text fontSize="sm" color="gray.500">
                    Already have an account? <Button variant="link" colorScheme="teal" onClick={() => navigate('/login')}>Login</Button>
                </Text>
            </VStack>
        </Box>
    );
}

export default SignUp;
