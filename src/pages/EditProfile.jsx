// src/pages/EditProfile.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    Checkbox,
    CheckboxGroup,
    Stack,
    Button,
    HStack,
    VStack,
    useToast,
    Spinner
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

function EditProfile() {
    const { profile, loading, saveProfile } = useProfile();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [preferredName, setPreferredName] = useState('');
    const [personality, setPersonality] = useState('Reflective');
    const [copilotStyle, setCopilotStyle] = useState('Warm & supportive');
    const [interests, setInterests] = useState([]);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setPreferredName(profile.preferredName || '');
            setPersonality(profile.personality || 'Reflective');
            setCopilotStyle(profile.copilotStyle || 'Warm & supportive');
            setInterests(profile.interests || []);
        }
    }, [profile]);

    const handleSubmit = async () => {
        await saveProfile({
            ...profile,
            firstName,
            lastName,
            preferredName,
            personality,
            copilotStyle,
            interests
        });

        toast({
            title: 'Profile updated!',
            status: 'success',
            duration: 3000,
            isClosable: true
        });

        navigate('/profile');
    };

    if (loading) return <Spinner size="lg" mt={10} />;

    return (
        <Box maxW="600px" mx="auto" p={8} bg="white" boxShadow="md" borderRadius="md" mt={6}>
            <Heading mb={6}>Edit Profile</Heading>

            <VStack spacing={4} align="stretch">
                <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Preferred Name</FormLabel>
                    <Input value={preferredName} onChange={(e) => setPreferredName(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Personality</FormLabel>
                    <Select value={personality} onChange={(e) => setPersonality(e.target.value)}>
                        <option>Reflective</option>
                        <option>Goal-Oriented</option>
                        <option>Creative</option>
                        <option>Analytical</option>
                        <option>Curious</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Preferred Copilot Style</FormLabel>
                    <Select value={copilotStyle} onChange={(e) => setCopilotStyle(e.target.value)}>
                        <option>Warm & supportive</option>
                        <option>Direct & motivational</option>
                        <option>Mindful & calming</option>
                        <option>Playful & fun</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Topics you care about</FormLabel>
                    <CheckboxGroup value={interests} onChange={setInterests}>
                        <Stack spacing={2}>
                            <Checkbox value="Mindfulness">Mindfulness</Checkbox>
                            <Checkbox value="Productivity">Productivity</Checkbox>
                            <Checkbox value="Emotional Awareness">Emotional Awareness</Checkbox>
                            <Checkbox value="Relationships">Relationships</Checkbox>
                            <Checkbox value="Career Growth">Career Growth</Checkbox>
                        </Stack>
                    </CheckboxGroup>
                </FormControl>

                <HStack spacing={4} pt={4}>
                    <Button colorScheme="teal" onClick={handleSubmit}>
                        Save Profile
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/profile')}>
                        Cancel
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
}

export default EditProfile;
