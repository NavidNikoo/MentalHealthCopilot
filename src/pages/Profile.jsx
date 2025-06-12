// src/pages/Profile.jsx
import {
    Box,
    Heading,
    Text,
    Button,
    Avatar,
    HStack,
    VStack,
    Wrap,
    WrapItem,
    Tag,
    Spinner,
    useToast
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Profile() {
    const { user } = useAuth();
    const { profile, loading, saveProfile } = useProfile();
    const navigate = useNavigate();
    const toast = useToast();

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            await saveProfile({
                ...profile,
                avatarUrl: url
            });

            toast({
                title: 'Profile picture updated!',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch (err) {
            console.error('Avatar upload error:', err);
            toast({
                title: 'Error uploading avatar',
                description: err.message,
                status: 'error',
                duration: 4000,
                isClosable: true
            });
        }
    };

    if (loading) return <Spinner size="lg" mt={10} />;

    return (
        <Box p={8}>
            <Heading mb={6}>My Profile</Heading>

            {!profile ? (
                <>
                    <Text mb={4}>No profile found. You can take the Welcome Quiz to set up your profile:</Text>
                    <Button as={RouterLink} to="/welcome" colorScheme="teal">
                        Take Welcome Quiz
                    </Button>
                </>
            ) : (
                <>
                    <HStack spacing={6} align="center" mb={6}>
                        <Avatar
                            size="xl"
                            src={profile.avatarUrl || '/default-avatar.png'}
                            name={`${profile.firstName || ''} ${profile.lastName || ''}`}
                        />
                        <VStack align="start" spacing={1}>
                            <Text fontSize="xl" fontWeight="bold">
                                {profile.firstName || '(First Name)'} {profile.lastName || '(Last Name)'}
                            </Text>
                            <Text color="gray.600">Preferred Name: {profile.preferredName || '(Not set)'}</Text>
                            <Text color="gray.600">Email: {user?.email}</Text>
                            <Text color="gray.600">Joined: {profile.createdAt ? new Date(profile.createdAt).toDateString() : '(Unknown)'}</Text>
                        </VStack>
                    </HStack>

                    <Box mb={6}>
                        <Text fontWeight="bold" mb={1}>Personality:</Text>
                        <Text>{profile.personality || '(Not set)'}</Text>
                    </Box>

                    <Box mb={6}>
                        <Text fontWeight="bold" mb={1}>Preferred Copilot Style:</Text>
                        <Text>{profile.copilotStyle || '(Not set)'}</Text>
                    </Box>

                    <Box mb={6}>
                        <Text fontWeight="bold" mb={2}>Interests:</Text>
                        {profile.interests && profile.interests.length > 0 ? (
                            <Wrap>
                                {profile.interests.map((interest) => (
                                    <WrapItem key={interest}>
                                        <Tag size="md" colorScheme="teal">{interest}</Tag>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        ) : (
                            <Text color="gray.500">(No interests set)</Text>
                        )}
                    </Box>

                    <HStack spacing={4}>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                style={{ display: 'none' }}
                            />
                            <Button colorScheme="blue" variant="outline">
                                Change Profile Picture
                            </Button>
                        </label>

                        <Button
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => navigate('/edit-profile')}
                        >
                            Edit Profile
                        </Button>

                        <Button as={RouterLink} to="/welcome" colorScheme="teal">
                            Retake Welcome Quiz
                        </Button>
                    </HStack>
                </>
            )}
        </Box>
    );
}

export default Profile;
