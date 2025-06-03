import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
    Text,
    Stack,
    Box,   // 🔥 ADD THIS
    useDisclosure,
    useToast
} from '@chakra-ui/react';

import { useState, useEffect } from 'react';

function JournalEntryModal({ isOpen, onClose, entry, onSave }) {
    const [note, setNote] = useState('');
    const [response, setResponse] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (entry) {
            setNote(entry.note || '');
            setResponse(entry.response || '');
        }
    }, [entry]);

    const handleSave = () => {
        const updatedEntry = {
            ...entry,
            note,
            response
        };
        onSave(updatedEntry);
        toast({
            title: 'Entry updated!',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
        onClose();
    };

    if (!entry) return null;

    // Format the date nicely
    const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Journal Entry - {formattedDate}
                </ModalHeader>
                <ModalCloseButton
                    color="gray.600"
                    _hover={{ color: "gray.800" }}
                    _focus={{ boxShadow: "none" }}
                />

                <ModalBody>
                    <Stack spacing={4}>
                        <Text fontWeight="bold">Mood: {entry.label}</Text>

                        <Textarea
                            placeholder="Your note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                        />
                        <Box>
                            <Text fontWeight="bold" mb={2}>
                                AI Reflection:
                            </Text>
                            <Textarea
                                value={entry.reflection || 'No reflection yet.'}
                                isReadOnly
                                rows={12}   // 🔥 Bigger, fits full reflection!
                                resize="none"
                                bg="gray.50"
                            />
                        </Box>
                        <Textarea
                            placeholder="Write your response or further thoughts..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            rows={5}
                        />
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSave}>
                        Save Changes
                    </Button>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default JournalEntryModal;
