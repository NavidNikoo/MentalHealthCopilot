import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';

function JournalCard({ date, mood, note, onClick }) {
    return (
        <Box
            p={4}
            borderRadius="md"
            boxShadow="md"
            bg={useColorModeValue('white', 'gray.700')}
            cursor="pointer"
            _hover={{ boxShadow: 'xl' }}
            onClick={onClick}
            minW="200px"
        >
            <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.500">{date}</Text>
                <Text fontWeight="bold">Mood: {mood}</Text>
                <Text noOfLines={2} fontSize="sm" color="gray.600">{note}</Text>
            </VStack>
        </Box>
    );
}

export default JournalCard;
