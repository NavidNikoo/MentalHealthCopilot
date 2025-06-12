// src/components/QuizStep.jsx
import { Box, Text, Button } from '@chakra-ui/react';

function QuizStep({ step, onNext, onBack, isLastStep }) {
    return (
        <Box
            p={8}
            borderRadius="md"
            boxShadow="md"
            bg="white"
            textAlign="center"
            maxW="500px"
            mx="auto"
        >
            <Text fontSize="lg" mb={6}>{step.question}</Text>

            {step.render && step.render()}

            <Box mt={6} display="flex" justifyContent="space-between">
                {onBack && (
                    <Button variant="outline" onClick={onBack}>
                        Back
                    </Button>
                )}
                <Button colorScheme="teal" onClick={onNext}>
                    {isLastStep ? 'Finish' : 'Next'}
                </Button>
            </Box>
        </Box>
    );
}

export default QuizStep;
