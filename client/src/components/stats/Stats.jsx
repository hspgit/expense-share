import React from 'react';
import {
    Box,
    Card,
    CardBody,
    Center,
    Divider,
    Flex,
    Heading,
    HStack,
    Icon,
    SimpleGrid,
    Spinner,
    Stat,
    StatArrow,
    StatHelpText,
    StatNumber,
    Text,
    useColorModeValue,
    VStack
} from '@chakra-ui/react';
import {FaChartBar, FaExchangeAlt, FaMoneyBill, FaRegChartBar, FaUsers} from 'react-icons/fa';
import {gql, useQuery} from '@apollo/client';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const GET_STATS = gql`
    query GetStats {
        stats {
            totalExpenses {
                totalAmount
                monthlyChange
            }
            sharedExpenses {
                totalAmount
                monthlyChange
            }
            friendsActivity {
                activeCount
                newThisMonth
            },
            expensesByCategory {
                name
                amount
                percentage
            }
        }
    }
`;

const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y
                                                                                           + height}
  Z`;
};

const TriangleBar = (props) => {
    const {fill, x, y, width, height} = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill}/>;
};

const getCategoryColor = (colorStr) => {
    const colorMap = {
        'Food': '#38A169',
        'Travel': '#3182CE',
        'Shopping': '#805AD5',
        'Entertainment': '#D53F8C',
        'Healthcare': '#D69E2E',
        'Other': '#718096',
    };

    return colorMap[colorStr] || '#718096';
};

function Stats() {
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const {loading, error, data} = useQuery(GET_STATS, {
        fetchPolicy: 'cache-and-network'
    });

    if (loading) {
        return (
            <Center h="200px">
                <Spinner size="xl" color="blue.500"/>
                <Text mt={4} color="gray.500">Loading your stats...</Text>
            </Center>
        );
    }

    if (error) {
        return (
            <Box px={8} py={8} w="100%">
                <Text color="red.500">Error loading statistics: {error.message}</Text>
            </Box>
        );
    }

    const {totalExpenses, sharedExpenses, friendsActivity, expensesByCategory} = data.stats;

    return (
        <Box px={8} py={8} w="100%">
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                    <HStack>
                        <Icon as={FaChartBar} color="blue.500" boxSize={6}/>
                        <Heading size="lg" color="blue.600">
                            Your Statistics
                        </Heading>
                    </HStack>
                </Flex>

                <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={6}>

                    <Card bg={cardBg} border="1px" borderColor={borderColor}>
                        <CardBody>
                            <VStack align="start" spacing={4}>
                                <HStack>
                                    <Icon as={FaMoneyBill} color="green.500" boxSize={5}/>
                                    <Heading size="md">Total Expenses</Heading>
                                </HStack>
                                <Divider/>
                                <Stat>
                                    <StatNumber fontSize="2xl">${totalExpenses.totalAmount.toFixed(
                                        2)}</StatNumber>
                                    <StatHelpText>
                                        <StatArrow
                                            type={totalExpenses.monthlyChange >= 0 ? "increase"
                                                                                   : "decrease"}/>
                                        {Math.abs(totalExpenses.monthlyChange).toFixed(1)}% from
                                        last month
                                    </StatHelpText>
                                </Stat>
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card bg={cardBg} border="1px" borderColor={borderColor}>
                        <CardBody>
                            <VStack align="start" spacing={4}>
                                <HStack>
                                    <Icon as={FaExchangeAlt} color="blue.500" boxSize={5}/>
                                    <Heading size="md">Shared Expenses</Heading>
                                </HStack>
                                <Divider/>
                                <Stat>
                                    <StatNumber fontSize="2xl">${sharedExpenses.totalAmount.toFixed(
                                        2)}</StatNumber>
                                    <StatHelpText>
                                        <StatArrow
                                            type={sharedExpenses.monthlyChange >= 0 ? "increase"
                                                                                    : "decrease"}/>
                                        {Math.abs(sharedExpenses.monthlyChange).toFixed(1)}% from
                                        last month
                                    </StatHelpText>
                                </Stat>
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card bg={cardBg} border="1px" borderColor={borderColor}>
                        <CardBody>
                            <VStack align="start" spacing={4}>
                                <HStack>
                                    <Icon as={FaUsers} color="purple.500" boxSize={5}/>
                                    <Heading size="md">Friends Activity</Heading>
                                </HStack>
                                <Divider/>
                                <Stat>
                                    <StatNumber
                                        fontSize="2xl">{friendsActivity.activeCount} Active</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type="increase"/>
                                        {friendsActivity.newThisMonth} new this month
                                    </StatHelpText>
                                </Stat>
                            </VStack>
                        </CardBody>
                    </Card>
                </SimpleGrid>

                <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                        <VStack align="start" spacing={4}>
                            <HStack>
                                <Icon as={FaRegChartBar} color="orange.500" boxSize={5}/>
                                <Heading size="md">Expenses by Category</Heading>
                            </HStack>
                            <Divider/>

                            {expensesByCategory.length === 0 ? (
                                <VStack align="center" spacing={4} py={8} w="100%">
                                    <Text color="gray.500">No expense data available</Text>
                                </VStack>
                            ) : (
                                 <Box h="300px" w="100%">
                                     <ResponsiveContainer width="100%" height="100%">
                                         <BarChart
                                             data={expensesByCategory}
                                             margin={{
                                                 top: 20, right: 30, left: 20, bottom: 5,
                                             }}
                                         >
                                             <CartesianGrid strokeDasharray="3 3"/>
                                             <XAxis dataKey="name"/>
                                             <YAxis/>
                                             <Tooltip
                                                 formatter={(value, name, props) => {
                                                     const item = props.payload;
                                                     return [`$${value.toFixed(
                                                         2)} (${item.percentage.toFixed(1)}%)`,
                                                             'Amount'];
                                                 }}
                                             />
                                             <Legend
                                                 width={100}
                                                 wrapperStyle={{
                                                     top: 40,
                                                     right: 20,
                                                     backgroundColor: '#f5f5f5',
                                                     border: '1px solid #d5d5d5',
                                                     borderRadius: 3,
                                                     lineHeight: '40px'
                                                 }}/>
                                             <Bar
                                                 dataKey="amount"
                                                 fill="#8884d8"
                                                 shape={<TriangleBar/>}
                                                 label={{
                                                     position: 'top',
                                                     formatter: (value) => `$${value.toFixed(0)}`
                                                 }}
                                                 legendType="circle"
                                             >
                                                 {expensesByCategory.map((entry, index) => (
                                                     <Cell key={`cell-${index}`}
                                                           fill={getCategoryColor(entry.name)}/>
                                                 ))}
                                             </Bar>
                                         </BarChart>
                                     </ResponsiveContainer>
                                 </Box>
                             )}
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
}

export default Stats;
