import { Box, Heading, Text, Stack, Icon } from '@chakra-ui/react';
import { FaHeart, FaBrain, FaFeatherAlt } from 'react-icons/fa';

function MissionSection() {
    return (
        <Box as="section" py={16} px={8} bg="gray.50">
            <Stack spacing={6} textAlign="center" maxW="3xl" mx="auto">
                <Heading fontSize="3xl">Our Mission</Heading>
                <Text fontSize="lg" color="gray.600">
                    We believe everyone deserves access to tools that support their emotional well-being.
                    Mental Health Copilot is built to help you reflect, grow, and thrive — one step, one journal entry, and one conversation at a time.
                </Text>
                <Stack direction={['column', 'row']} spacing={12} pt={8} justify="center">
                    <Box>
                        <Icon as={FaHeart} boxSize={8} color="teal.400" />
                        <Text fontWeight="bold" mt={2}>Compassion First</Text>
                        <Text color="gray.500">Designed with empathy and support at the core.</Text>
                    </Box>
                    <Box>
                        <Icon as={FaBrain} boxSize={8} color="teal.400" />
                        <Text fontWeight="bold" mt={2}>Built with Purpose</Text>
                        <Text color="gray.500">Guided by psychology and user research.</Text>
                    </Box>
                    <Box>
                        <Icon as={FaFeatherAlt} boxSize={8} color="teal.400" />
                        <Text fontWeight="bold" mt={2}>Empowering Growth</Text>
                        <Text color="gray.500">Helping you stay grounded and resilient.</Text>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}

export default MissionSection;
