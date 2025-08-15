import React from 'react';
import {gql, useQuery} from '@apollo/client';
import {Alert, AlertIcon, Box, Heading, Icon, SimpleGrid, Spinner, Text,} from '@chakra-ui/react';
import {FaReceipt} from 'react-icons/fa';
import ExpenseCard from './ExpenseCard';

const GET_EXPENSES = gql`
    query GetExpenses {
        expenses {
            id
            userId
            category
            name
            amount
            date
            createdAt
            isShared
            paidBy
            participants {
                userId
                user {
                    id
                    name
                    email
                    avatar
                }
                amount
            }
        }
    }
`;

function ExpenseList({user, selectedCategory = 'All', selectedShareType = 'All'}) {
    const {data, loading, error} = useQuery(GET_EXPENSES, {
        context: {
            headers: {
                userId: user?.googleId,
            },
        },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    });

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" color="blue.500"/>
                <Text mt={4} color="gray.500">Loading your expenses...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" borderRadius="md">
                <AlertIcon/>
                Error loading expenses: {error.message}
            </Alert>
        );
    }

    const expenses = data?.expenses || [];

    if (expenses.length === 0) {
        return (
            <Box textAlign="center" py={16}>
                <Icon as={FaReceipt} size="64px" color="gray.300" mb={4}/>
                <Heading size="md" color="gray.500" mb={2}>
                    No expenses yet
                </Heading>
                <Text color="gray.400">
                    Create your first expense to get started!
                </Text>
            </Box>
        );
    }

    const filteredExpenses = expenses.filter(e => {
        const categoryMatch = selectedCategory === 'All' || e.category === selectedCategory;
        const shareMatch = selectedShareType === 'All' || (selectedShareType === 'Shared'
                                                           ? e.isShared : !e.isShared);
        return categoryMatch && shareMatch;
    });

    if (filteredExpenses.length === 0) {
        const shareLabel = selectedShareType === 'All' ? '' : selectedShareType + ' ';
        const categoryLabel = selectedCategory === 'All' ? '' : selectedCategory + ' ';
        return (
            <Box textAlign="center" py={16}>
                <Icon as={FaReceipt} size="64px" color="gray.300" mb={4}/>
                <Heading size="md" color="gray.500" mb={2}>
                    No {shareLabel}{categoryLabel}expenses
                </Heading>
                <Text color="gray.400">
                    Try adjusting the filters.
                </Text>
            </Box>
        );
    }

    return (
        <SimpleGrid
            columns={{base: 2, md: 3, lg: 5}}
            spacing={3}
        >
            {filteredExpenses.map((expense) => (
                <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    user={user}
                />
            ))}
        </SimpleGrid>
    );
}

export default ExpenseList;
