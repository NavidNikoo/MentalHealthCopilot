import {
    Box,
    Button,
    Container,
    Heading,
    Stack,
    Text,
    VStack,
    HStack,
    Image,
    Icon,
    SimpleGrid,
    useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaPenFancy, FaRobot, FaChartBar } from 'react-icons/fa';
import MissionSection from '../components/MissionSection'; // ✅ Make sure this path is correct
import Footer from '../components/Footer';



export default function Landing() {
    return (
        <Box bg={useColorModeValue('#fdfdfd', '#111')} color={useColorModeValue('gray.800', 'gray.200')} minH="100vh">
            {/* Hero */}
            <Container maxW="5xl" py={20}>
                <VStack spacing={6} align="start">
                    <Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold">
                        Your Mental Health Copilot
                    </Heading>
                    <Text fontSize="lg" maxW="xl">
                        AI-powered emotional support, guided journaling, and mood tracking—all in one space. Stay grounded, reflect deeply, and grow.
                    </Text>
                    <Button
                        as={RouterLink}
                        to="/signup"
                        colorScheme="teal"
                        size="lg"
                        px={10}
                    >
                        Get Started
                    </Button>
                </VStack>
            </Container>

            {/* Features */}
            <Box py={20} bg={useColorModeValue('gray.50', 'gray.800')}>
                <Container maxW="6xl">
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                        <Feature icon={FaPenFancy} title="Guided Journaling" desc="Process emotions through structured prompts and reflections." />
                        <Feature icon={FaRobot} title="AI Copilot Chat" desc="Talk to emotionally-aware AI companions designed to support." />
                        <Feature icon={FaChartBar} title="Mood Insights" desc="Track patterns and gain insights about your emotional wellbeing." />
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Preview Section */}
            <Container maxW="6xl" py={20}>
                <VStack spacing={8}>
                    <Heading size="lg">See It In Action</Heading>
                    <Image
                        borderRadius="lg"
                        boxShadow="lg"
                        maxW="800px"
                        src="/preview/dashboard.png"
                        alt="App dashboard preview"
                    />
                </VStack>
            </Container>

            {/* ✅ Our Mission */}
            <MissionSection />

            {/* Call to Action */}
            <Box py={20} bg="teal.500" color="white" textAlign="center">
                <Heading fontSize="2xl" mb={4}>Start Your Wellness Journey Today</Heading>
                <Text mb={6}>Meet your AI companion and take control of your mental wellness.</Text>
                <Button as={RouterLink} to="/signup" colorScheme="whiteAlpha" size="lg">
                    Create Free Account
                </Button>
            </Box>

            <Footer />

        </Box>

);
}

function Feature({ icon, title, desc }) {
    return (
        <VStack align="start">
            <Icon as={icon} w={8} h={8} color="teal.400" />
            <Text fontWeight="bold" fontSize="xl">{title}</Text>
            <Text color="gray.500">{desc}</Text>
        </VStack>
    );
}
