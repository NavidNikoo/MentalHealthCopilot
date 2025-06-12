import { Box, Container, Text, Stack, Link, HStack, useColorModeValue } from '@chakra-ui/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.600', 'gray.400')} py={10}>
            <Container maxW="6xl">
                <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
                    <Text fontSize="sm">
                        © {new Date().getFullYear()} Mental Health Copilot. All rights reserved.
                    </Text>

                    <HStack spacing={4}>
                        <Link href="https://github.com/NavidNikoo/MentalHealthCopilot" isExternal>
                            <FaGithub />
                        </Link>
                        <Link href="https://www.linkedin.com/in/navid-nikoo/" isExternal>
                            <FaLinkedin />
                        </Link>
                        <Link href="/terms">Terms</Link>
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/contact">Contact</Link>
                    </HStack>
                </Stack>
            </Container>
        </Box>
    );
}
