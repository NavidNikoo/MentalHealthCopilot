import {
    Box,
    Avatar,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import characters from '../data/characters';

function CharacterHeader({ character, setCharacter }) {
    return (
        <Box
            position="sticky"
            top={0}
            bg="white"
            zIndex={1000}
            boxShadow="sm"
            borderBottom="1px solid #ccc"
        >
            <Menu>
                <MenuButton
                    as={Flex}
                    align="center"
                    justify="space-between"
                    cursor="pointer"
                    p={3}
                    _hover={{ bg: 'gray.100' }}
                >
                    <Flex align="center">
                        <Avatar src={character.avatar} name={character.name} size="md" mr={3} /> {/*possible values: 2xs, xs, sm, md, lg, xl, 2xl, full*/}
                        <Box>
                            <Text fontWeight="bold">{character.name}</Text>
                            <Text fontSize="sm" color="gray.600">{character.role}</Text>
                        </Box>
                    </Flex>
                    <ChevronDownIcon />
                </MenuButton>

                <MenuList>
                    {characters.map((char) => (
                        <MenuItem key={char.id} onClick={() => setCharacter(char)}>
                            <Avatar src={char.avatar} name={char.name} size="xs" mr={2} />
                            {char.name} - {char.role}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Box>
    );
}

export default CharacterHeader;
