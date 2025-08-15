import React from 'react';
import Login from './Login.jsx';
import {Box, Container, Heading, Icon, Text, useColorModeValue, VStack} from '@chakra-ui/react';
import {FaMoneyBillWave} from 'react-icons/fa';

function WelcomeScreen({setUser}) {
    const bg = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <Box minH="100vh" bg={bg} py={20}>
            <Container maxW="md">
                <VStack spacing={8} textAlign="center">
                    <Box
                        p={8}
                        bg={cardBg}
                        borderRadius="xl"
                        boxShadow="lg"
                        w="full"
                    >
                        <VStack spacing={6}>
                            <Icon as={FaMoneyBillWave} w={16} h={16} color="blue.500"/>
                            <VStack spacing={2}>
                                <Heading size="xl" color="blue.600">
                                    Welcome to Expense Share
                                </Heading>
                                <Text color="gray.600" fontSize="lg">
                                    Track and share your expenses with ease
                                </Text>
                            </VStack>
                            <Text color="gray.500" textAlign="center">
                                Sign in with your Google account to get started and manage your
                                personal expenses.
                            </Text>
                            <Login setUser={setUser}/>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
}

export default WelcomeScreen;
