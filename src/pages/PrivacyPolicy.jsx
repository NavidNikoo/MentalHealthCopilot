import { Box, Heading, Text, VStack, Link } from '@chakra-ui/react';

function PrivacyPolicy() {
    return (
        <Box p={8} maxW="6xl" mx="auto">
            <Heading mb={6}>Privacy Policy</Heading>
            <VStack align="start" spacing={4} fontSize="md">
                <Text>
                    <strong>Effective Date:</strong> July 1, 2025
                </Text>
                <Text>
                    At Vivamind, your privacy is not just important — it’s foundational. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our wellness tools, AI companions, journaling features, and related services.
                </Text>

                <Heading size="md" mt={6}>1. Information We Collect</Heading>
                <Text>- Personal Information: Name, email, preferred name, and profile data.</Text>
                <Text>- Usage Data: Mood entries, Copilot chats, and interactions within the app.</Text>
                <Text>- Device Info: IP address, browser type, OS, and device ID.</Text>
                <Text>- OAuth Data: If you sign in via Google or another provider, we receive basic account details.</Text>

                <Heading size="md" mt={6}>2. How We Use Your Data</Heading>
                <Text>- Personalize your experience with mood insights and journaling recommendations.</Text>
                <Text>- Provide and improve app functionality.</Text>
                <Text>- Diagnose performance and prevent abuse.</Text>
                <Text>- Never used for AI model training or sold to third parties.</Text>

                <Heading size="md" mt={6}>3. Legal Basis for Processing (EU/UK)</Heading>
                <Text>- Consent – for optional communications or features.</Text>
                <Text>- Contract – to deliver services you've signed up for.</Text>
                <Text>- Legal Obligation – to comply with laws.</Text>
                <Text>- Legitimate Interest – to enhance and secure our services.</Text>

                <Heading size="md" mt={6}>4. Data Storage & Security</Heading>
                <Text>- All data is encrypted and stored securely via Google Firebase.</Text>
                <Text>- Access is restricted to authorized personnel only.</Text>
                <Text>- We use HTTPS and best practices to prevent unauthorized access.</Text>

                <Heading size="md" mt={6}>5. AI-Powered Features</Heading>
                <Text>- AI chat and journaling are powered by OpenAI APIs.</Text>
                <Text>- Your prompts are processed only for functionality, not training.</Text>
                <Text>- No data is permanently stored or shared with third-party AI providers.</Text>

                <Heading size="md" mt={6}>6. Your Rights</Heading>
                <Text>- Access or correct your profile data.</Text>
                <Text>- Delete your account and associated data anytime.</Text>
                <Text>- Opt out of emails or other communications.</Text>
                <Text>To exercise your rights, email <Link href="mailto:VivamindInfo@gmail.com" color="teal.500">VivamindInfo@gmail.com</Link>.</Text>

                <Heading size="md" mt={6}>7. Data Retention</Heading>
                <Text>- We retain your data until you delete your account.</Text>
                <Text>- Once deleted, your data is permanently removed within 30 days unless legally required to retain it.</Text>

                <Heading size="md" mt={6}>8. Children’s Privacy</Heading>
                <Text>- Vivamind is not intended for children under 13 (or 16 in some regions).</Text>
                <Text>- If we learn that we've collected information from a child without consent, we will delete it.</Text>

                <Heading size="md" mt={6}>9. Changes to This Policy</Heading>
                <Text>- You will be notified of material updates via the app or email.</Text>
                <Text>- Continued use of Vivamind means you accept any changes.</Text>

                <Heading size="md" mt={6}>10. Contact</Heading>
                <Text>
                    If you have questions or concerns, please contact us at <Link href="mailto:supportVivamindInfo@gmail.com" color="teal.500">VivamindInfo@gmail.com</Link>.
                </Text>
            </VStack>
        </Box>
    );
}

export default PrivacyPolicy;
