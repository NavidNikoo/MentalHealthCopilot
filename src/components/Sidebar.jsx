import {
    Box,
    VStack,
    Text,
    Button,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Sidebar({
                     chats,
                     activeChatId,
                     onSelectChat,
                     onNewChat,
                     onRenameChat,
                     onDeleteChat,
                     onReorderChats
                 }) {
    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination || source.index === destination.index) return;

        const reordered = Array.from(chats);
        const [moved] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, moved);
        onReorderChats(reordered);
    };

    return (
        <Box
            w="260px"
            bg={useColorModeValue('gray.50', 'gray.800')}
            borderRight="1px solid"
            borderColor="gray.200"
            p={4}
            h="100vh"
            overflowY="auto"
            position="sticky"
            top="0"
        >
            <Text fontSize="lg" fontWeight="bold" mb={4} color="purple.700">
                Your Chats
            </Text>

            <Button
                colorScheme="teal"
                size="md"
                mb={4}
                onClick={onNewChat}
                width="100%"
            >
                + New Chat
            </Button>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="chatList">
                    {(provided) => (
                        <VStack
                            spacing={2}
                            align="stretch"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {chats.map((chat, index) => (
                                <Draggable key={chat.id} draggableId={String(chat.id)} index={index}>
                                    {(provided) => (
                                        <Box
                                            as="div"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{ userSelect: 'none' }}
                                            bg={chat.id === activeChatId ? 'purple.100' : 'white'}
                                            p={3}
                                            borderRadius="md"
                                            boxShadow="sm"
                                            cursor="pointer"
                                            _hover={{ bg: 'gray.100' }}
                                            onClick={() => onSelectChat(chat.id)}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Text
                                                isTruncated
                                                fontWeight={chat.id === activeChatId ? 'bold' : 'normal'}
                                                maxW="160px"
                                            >
                                                {chat.title || 'Untitled Chat'}
                                            </Text>

                                            <Menu>
                                                <MenuButton
                                                    as={IconButton}
                                                    icon={<HamburgerIcon />}
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <MenuList>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newTitle = prompt('Rename chat:', chat.title || 'Untitled');
                                                            if (newTitle) onRenameChat(chat.id, newTitle);
                                                        }}
                                                    >
                                                        Rename
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Are you sure you want to delete this chat?')) {
                                                                onDeleteChat(chat.id);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </VStack>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
}

export default Sidebar;
