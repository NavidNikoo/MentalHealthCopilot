import { Box, Text, Button, Stack } from '@chakra-ui/react';

function JournalCard({ entry, onGetReflection, onDelete, onOpenModal }) {
    if (!entry) return null;  // Safety

    const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Box
            borderWidth="1px"
            borderRadius="md"
            p={4}
            boxShadow="sm"
            cursor="pointer"
            onClick={onOpenModal}
            _hover={{ boxShadow: 'md' }}
            minH="220px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Box>
                <Text fontSize="md" fontWeight="bold" mb={2}>
                    {formattedDate}
                </Text>
                <Text fontWeight="bold">Mood:</Text> {entry.label}

                <Text mt={2} fontStyle="italic">
                    {entry.note || '(No note)'}
                </Text>

                {entry.reflection && (
                    <>
                        <Text fontWeight="bold" mt={3}>
                            Reflection:
                        </Text>
                        <Text noOfLines={3}>
                            {entry.reflection}
                        </Text>
                    </>
                )}
            </Box>

            <Stack mt={4} direction="row" spacing={2}>
                {entry.reflection ? (
                    <Button size="sm" colorScheme="gray" isDisabled>
                        Reflection Complete
                    </Button>
                ) : (
                    <Button size="sm" colorScheme="blue" onClick={(e) => {
                        e.stopPropagation();
                        onGetReflection(entry);
                    }}>
                        Get Reflection
                    </Button>
                )}
                <Button size="sm" colorScheme="red" onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry);
                }}>
                    Delete
                </Button>
            </Stack>
        </Box>
    );
}

export default JournalCard;
