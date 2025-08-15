import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Tab,
    TabList,
    Tabs,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import {FaChartBar, FaDollarSign, FaReceipt} from 'react-icons/fa';
import {GiThreeFriends} from "react-icons/gi";
import {useNavigate} from 'react-router-dom';

function Navbar({user, onLogout, activeTab, onTabChange}) {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const navigate = useNavigate();

    return (
        <Box
            bg={bg}
            borderBottom="1px"
            borderColor={borderColor}
            px={6}
            py={4}
            position="sticky"
            top={0}
            zIndex={1000}
            shadow="sm"
        >
            <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
                <HStack spacing={2} cursor="pointer" onClick={() => navigate('/expenses')}>
                    <Icon as={FaDollarSign} boxSize={6} color="blue.500"/>
                    <Text fontSize="xl" fontWeight="bold" color="blue.500">
                        Expense Share
                    </Text>
                </HStack>

                {user && (
                    <HStack spacing={6}>
                        <Tabs
                            index={activeTab}
                            onChange={onTabChange}
                            variant="soft-rounded"
                            colorScheme="blue"
                        >
                            <TabList>
                                <Tab>
                                    <Icon as={FaReceipt} mr={2}/>
                                    Expenses</Tab>
                                <Tab>
                                    <Icon as={GiThreeFriends} mr={2}/>
                                    Friends</Tab>
                                <Tab>
                                    <Icon as={FaChartBar} mr={2}/>
                                    Stats
                                </Tab>
                            </TabList>
                        </Tabs>

                        <HStack spacing={4}>
                            <HStack spacing={3}>
                                <Avatar size="sm" name={user.name} src={user.picture}/>
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium">
                                        {user.name}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        {user.email}
                                    </Text>
                                </Box>
                            </HStack>
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="red"
                                onClick={onLogout}
                            >
                                Logout
                            </Button>
                        </HStack>
                    </HStack>
                )}
            </Flex>
        </Box>
    );
}

export default Navbar;
