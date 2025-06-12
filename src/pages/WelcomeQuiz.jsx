// src/pages/WelcomeQuiz.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Progress, Checkbox, CheckboxGroup, Stack, RadioGroup, Radio, Input } from '@chakra-ui/react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import QuizStep from '../components/QuizStep';

function WelcomeQuiz() {
    const navigate = useNavigate();

    const [goal, setGoal] = useState('');
    const [personality, setPersonality] = useState('Reflective');
    const [copilotStyle, setCopilotStyle] = useState('Warm & supportive');
    const [interests, setInterests] = useState([]);

    const steps = [
        {
            question: '🌟 What is your primary goal?',
            render: () => (
                <Input
                    placeholder="Type your goal..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                />
            )
        },
        {
            question: '🧠 How would you describe yourself?',
            render: () => (
                <RadioGroup value={personality} onChange={setPersonality}>
                    <Stack direction="column">
                        <Radio value="Reflective">Reflective</Radio>
                        <Radio value="Goal-Oriented">Goal-Oriented</Radio>
                        <Radio value="Creative">Creative</Radio>
                        <Radio value="Analytical">Analytical</Radio>
                        <Radio value="Curious">Curious</Radio>
                    </Stack>
                </RadioGroup>
            )
        },
        {
            question: '🤝 What kind of Copilot style do you prefer?',
            render: () => (
                <RadioGroup value={copilotStyle} onChange={setCopilotStyle}>
                    <Stack direction="column">
                        <Radio value="Warm & supportive">Warm & supportive</Radio>
                        <Radio value="Direct & motivational">Direct & motivational</Radio>
                        <Radio value="Mindful & calming">Mindful & calming</Radio>
                        <Radio value="Playful & fun">Playful & fun</Radio>
                    </Stack>
                </RadioGroup>
            )
        },
        {
            question: '🎯 What topics do you care about?',
            render: () => (
                <CheckboxGroup value={interests} onChange={setInterests}>
                    <Stack direction="column">
                        <Checkbox value="Mindfulness">Mindfulness</Checkbox>
                        <Checkbox value="Productivity">Productivity</Checkbox>
                        <Checkbox value="Emotional Awareness">Emotional Awareness</Checkbox>
                        <Checkbox value="Relationships">Relationships</Checkbox>
                        <Checkbox value="Career Growth">Career Growth</Checkbox>
                    </Stack>
                </CheckboxGroup>
            )
        }
    ];

    const [stepIndex, setStepIndex] = useState(0);

    const handleNext = async () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            // Save profile to Firestore
            if (!auth.currentUser) return;

            const profileRef = doc(db, 'users', auth.currentUser.uid, 'profile', 'main');
            await setDoc(profileRef, {
                goal,
                personality,
                copilotStyle,
                interests,
                updatedAt: new Date().toISOString()
            });

            // Go to Dashboard
            navigate('/dashboard');
        }
    };

    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };

    return (
        <Box py={10} px={4}>
            <Progress
                value={((stepIndex + 1) / steps.length) * 100}
                size="sm"
                colorScheme="teal"
                mb={6}
                maxW="500px"
                mx="auto"
            />
            <QuizStep
                step={steps[stepIndex]}
                onNext={handleNext}
                onBack={stepIndex > 0 ? handleBack : null}
                isLastStep={stepIndex === steps.length - 1}
            />
        </Box>
    );
}

export default WelcomeQuiz;
