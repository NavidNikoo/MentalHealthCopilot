// components/Header.jsx

import { Box, Flex, Text, Button, Link, Spacer, Avatar, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';


function Header({ user, onLogout }) {
    const location = useLocation();

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Journal', path: '/journal' },
        { label: 'Copilot Chat', path: '/copilot' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Profile', path: '/profile' },   // ✅ ADD THIS LINE
    ];

    return (
        <Box
            bg="white"
            px={6}
            py={3}
            borderBottom="1px solid #e2e8f0"
            boxShadow="sm"
            position="sticky"
            top="0"
            zIndex="999"
        >
            <Flex align="center">
                {/* Logo + App Name */}
                <HStack spacing={2}>
                    <Avatar size="sm" src="/logo.png" />
                    <Text fontSize="lg" fontWeight="bold" color="teal.600">
                        Mental Health Copilot
                    </Text>
                </HStack>

                <Spacer />

                {/* Navigation */}
                <HStack spacing={6}>
                    {user && navLinks.map((link) => (
                        <Link
                            key={link.path}
                            as={RouterLink}
                            to={link.path}
                            fontWeight={location.pathname === link.path ? 'bold' : 'medium'}
                            color={location.pathname === link.path ? 'teal.600' : 'gray.600'}
                            _hover={{ textDecoration: 'none', color: 'teal.500' }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {!user && (
                        <>
                            <Link
                                as={RouterLink}
                                to="/login"
                                fontWeight={location.pathname === '/login' ? 'bold' : 'medium'}
                                color={location.pathname === '/login' ? 'teal.600' : 'gray.600'}
                                _hover={{ textDecoration: 'none', color: 'teal.500' }}
                            >
                                Login
                            </Link>
                            <Link
                                as={RouterLink}
                                to="/signup"
                                fontWeight={location.pathname === '/signup' ? 'bold' : 'medium'}
                                color={location.pathname === '/signup' ? 'teal.600' : 'gray.600'}
                                _hover={{ textDecoration: 'none', color: 'teal.500' }}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </HStack>

                <Spacer />

                {/* User Actions */}
                {user && (
                    <HStack spacing={4}>
                        <Text fontSize="sm" color="gray.600">
                            Logged in as: {user.email}
                        </Text>
                        <Button size="sm" colorScheme="teal" variant="outline" onClick={onLogout}>
                            Logout
                        </Button>
                    </HStack>
                )}
            </Flex>
        </Box>
    );
}

export default Header;
