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
    useToast,
    Flex,
    Badge
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { storage, functions, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { useEffect } from 'react';

function Profile() {
    const { user } = useAuth();
    const { profile, loading, saveProfile, refresh, isPremium } = useProfile();

    const navigate = useNavigate();
    const toast = useToast();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    useEffect(() => {
        const url = new URL(window.location.href);
        const sessionId = url.searchParams.get('session_id');
        if (sessionId) {
            refresh();
        }
    }, []);

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

    const handleBuyPremium = async () => {
        try {
            const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
            const result = await createCheckoutSession({
                priceId: 'price_1RfoGrDQXPUMRmYatoq0kKTv'
            });

            if (result.data && result.data.url) {
                window.location.href = result.data.url;
            } else {
                throw new Error("Checkout URL not returned.");
            }
        } catch (error) {
            console.error('Stripe checkout error:', error);
            toast({
                title: 'Payment Error',
                description: error.message || 'Something went wrong.',
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
                    <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
                        {/* Left Panel */}
                        <VStack spacing={4} align="center" flex="1">
                            <Avatar
                                size="2xl"
                                src={profile.avatarUrl || '/default-avatar.png'}
                                name={`${profile.firstName || ''} ${profile.lastName || ''}`}
                            />
                            <Text fontSize="xl" fontWeight="bold">
                                {profile.firstName || '(First Name)'} {profile.lastName || '(Last Name)'}
                            </Text>
                            <Text color="gray.500">
                                Preferred Name: {profile.preferredName || 'Not set'}
                            </Text>
                            <Text color="gray.500">Email: {user?.email}</Text>
                            <Text color="gray.500">
                                Joined: {profile.createdAt ? new Date(profile.createdAt).toDateString() : '(Unknown)'}
                            </Text>
                            {isPremium && (
                                <Text color="green.500" fontWeight="bold">
                                    🌟 Premium Member
                                </Text>
                            )}
                        </VStack>

                        {/* Right Panel */}
                        <VStack spacing={4} align="start" flex="2">
                            <Box>
                                <Text fontWeight="semibold">Personality:</Text>
                                <Text>{profile.personality || 'Not set'}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Preferred Copilot Style:</Text>
                                <Text>{profile.copilotStyle || 'Not set'}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Interests:</Text>
                                <HStack spacing={2} mt={2} wrap="wrap">
                                    {(profile?.interests || []).map((interest) => (
                                        <Badge key={interest} colorScheme="teal" px={2} py={1} borderRadius="md">
                                            {interest}
                                        </Badge>
                                    ))}
                                </HStack>
                            </Box>
                        </VStack>
                    </Flex>

                    {/* Action Buttons */}
                    <Flex mt={10} wrap="wrap" gap={4}>
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

                        {!isPremium && (
                            <Button colorScheme="green" onClick={handleBuyPremium}>
                                Upgrade to Premium
                            </Button>
                        )}

                        <Button colorScheme="red" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Flex>
                </>
            )}
        </Box>
    );
}

export default Profile;