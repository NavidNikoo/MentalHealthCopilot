import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Avatar,
    Text,
    Flex,
    Box,
    Button
} from '@chakra-ui/react';
import characters from '../data/characters';
import { saveChatMessageToSession } from '../utils/firebaseUtils';
import { auth } from '../firebase';

function CharacterHeader({ character, setCharacter, setMessages, activeChatId }) {
    const handleCharacterSwitch = async (char) => {
        setCharacter(char);

        if (!auth.currentUser || !activeChatId) return;

        const systemMessage = {
            role: 'system',
            content: `You switched to ${char.name} (${char.role}).`
        };

        await saveChatMessageToSession(auth.currentUser.uid, activeChatId, systemMessage);

        setMessages(prev => [...prev, systemMessage]);
    };

    return (
        <Flex
            align="center"
            justify="flex-start"
            py={3}                 // more balanced padding
            px={6}                 // wider spacing
            bg="white"
            boxShadow="sm"         // soft shadow instead of ugly border line
        >
            <Menu>
                <MenuButton
                    as={Button}
                    variant="ghost"
                    _hover={{ bg: 'gray.100' }}    // slightly stronger hover
                    _active={{ bg: 'gray.200' }}
                    px={4}                        // wider horizontal padding
                    py={3}                        // taller vertical padding
                    borderRadius="md"
                    cursor="pointer"
                >
                    <Flex align="center" gap={4}>   {/* more gap */}
                        <Avatar src={character.avatar} name={character.name} size="md" />
                        <Box textAlign="left">
                            <Text fontWeight="bold" fontSize="md">
                                {character.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                {character.role}
                            </Text>
                        </Box>
                    </Flex>
                </MenuButton>

                <MenuList>
                    {characters.map((char) => (
                        <MenuItem key={char.id} onClick={() => handleCharacterSwitch(char)}>
                            <Flex align="center" gap={3}>
                                <Avatar src={char.avatar} name={char.name} size="sm" />
                                <Box>
                                    <Text fontWeight="medium">{char.name}</Text>
                                    <Text fontSize="xs" color="gray.500">
                                        {char.role}
                                    </Text>
                                </Box>
                            </Flex>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Flex>
    );
}

export default CharacterHeader;
