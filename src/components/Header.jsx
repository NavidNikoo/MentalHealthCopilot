// src/components/Header.jsx
import {
    Box,
    Flex,
    Text,
    Link,
    Spacer,
    HStack,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const navLinks = [
        { label: 'Journal', path: '/journal' },
        { label: 'Copilot Chat', path: '/copilot' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Profile', path: '/profile' },
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
            <Flex align="center" justify="space-between">
                {/* Left: Logo */}
                <HStack spacing={2}>
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="teal.600"
                        as={RouterLink}
                        to="/"
                        _hover={{ textDecoration: 'none', opacity: 0.8 }}
                    >
                        VIVAMIND
                    </Text>
                </HStack>

                {/* Center: Navigation */}
                {user && (
                    <HStack spacing={6}>
                        {navLinks.map((link) => (
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
                    </HStack>
                )}

                {/* Right: Avatar Menu */}
                {user && (
                    <Menu>
                        <MenuButton>
                            <Avatar
                                size="sm"
                                name={user.displayName || user.email}
                                src={user.photoURL}
                            />
                        </MenuButton>
                        <MenuList>
                            <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                )}

                {!user && (
                    <HStack spacing={4}>
                        <Button as={RouterLink} to="/login" size="sm" variant="ghost" colorScheme="teal">
                            Login
                        </Button>
                        <Button as={RouterLink} to="/signup" size="sm" colorScheme="teal">
                            Sign Up
                        </Button>
                    </HStack>
                )}
            </Flex>
        </Box>
    );
}

export default Header;
