import { Box, Heading, Text, VStack, Link } from '@chakra-ui/react';

function ContactUs() {
    return (
        <Box p={8} maxW="4xl" mx="auto">
            <Heading mb={4}>Contact Us</Heading>
            <VStack align="start" spacing={4}>
                <Text>If you have any questions, feedback, or need support, we’re here to help.</Text>
                <Text>
                    📧 Email: <Link href="mailto:VivamindInfo@gmail.com" color="teal.500">VivamindInfo@gmail.com</Link>
                </Text>
                <Text>
                    📍 Based: Orange County, California
                </Text>
            </VStack>
        </Box>
    );
}

export default ContactUs;
