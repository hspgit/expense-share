import React, {useRef} from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Avatar,
    AvatarGroup,
    Badge,
    Button,
    Card,
    CardBody,
    Flex,
    HStack,
    Icon,
    IconButton,
    Stat,
    StatArrow,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaFileAlt,
    FaFilm,
    FaHospital,
    FaList,
    FaPlane,
    FaShoppingBag,
    FaTrash,
    FaUsers,
    FaUtensils
} from 'react-icons/fa';
import {gql, useMutation} from '@apollo/client';

const DELETE_EXPENSE = gql`
    mutation DeleteExpense($id: ID!) {
        deleteExpense(id: $id)
    }
`;

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

const getCategoryIcon = (category) => {
    const icons = {
        Food: FaUtensils,
        Travel: FaPlane,
        Shopping: FaShoppingBag,
        Entertainment: FaFilm,
        Healthcare: FaHospital,
        Other: FaFileAlt,
    };
    return icons[category] || FaList;
};

const getCategoryColor = (category) => {
    const colors = {
        Food: 'green.600',
        Travel: 'blue.600',
        Shopping: 'purple.600',
        Entertainment: 'pink.600',
        Healthcare: 'yellow.600',
        Other: 'gray.600',
    };
    return colors[category] || 'gray.600';
};

const getCategoryCardBorderColor = (category) => {
    const colors = {
        Food: 'green.300',
        Travel: 'blue.300',
        Shopping: 'purple.300',
        Entertainment: 'pink.300',
        Healthcare: 'yellow.300',
        Other: 'gray.300',
    };
    return colors[category] || 'gray.100';
};

const getCategoryBg = (category, isDarkMode) => {
    const light = {
        Food: 'green.50',
        Travel: 'blue.50',
        Shopping: 'purple.50',
        Entertainment: 'pink.50',
        Healthcare: 'yellow.50',
        Other: 'gray.50'
    };
    const dark = {
        Food: 'green.700',
        Travel: 'blue.700',
        Shopping: 'purple.700',
        Entertainment: 'pink.700',
        Healthcare: 'yellow.700',
        Other: 'gray.700'
    };
    return isDarkMode ? (dark[category] || 'gray.700') : (light[category] || 'gray.50');
};

const getCategoryBadgeScheme = (category) => {
    const map = {
        Food: 'green',
        Travel: 'blue',
        Shopping: 'purple',
        Entertainment: 'pink',
        Healthcare: 'yellow',
        Other: 'gray'
    };
    return map[category] || 'gray';
};

function ExpenseCard({expense, user}) {
    const borderColor = getCategoryCardBorderColor(expense.category);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const cancelRef = useRef();
    const toast = useToast();

    const [deleteExpense, {loading: deleting}] = useMutation(DELETE_EXPENSE, {
        refetchQueries: [{query: GET_EXPENSES}],
        awaitRefetchQueries: true,
        onCompleted: () => {
            toast({title: 'Expense deleted', status: 'success', duration: 2000});
        },
        onError: (err) => {
            toast({title: err.message, status: 'error', duration: 3000});
        }
    });

    const calculateUserBalance = (expense) => {

        if (!expense.isShared || !user) {
            return {balance: 0, isOwed: false, owes: false, userOwes: 0, userPaid: 0};
        }

        const userParticipant = expense.participants?.find(p => p.userId === user.googleId);
        const userOwes = userParticipant ? (userParticipant.amount || 0) : 0;
        const userPaid = expense.paidBy === user.googleId ? (expense.amount || 0) : 0;

        const balance = userPaid - userOwes;

        return {
            balance: Math.abs(balance),
            isOwed: balance > 0,
            owes: balance < 0,
            userOwes: userOwes,
            userPaid: userPaid
        };
    };

    const handleDelete = async () => {
        try {
            await deleteExpense({
                                    variables: {id: expense.id},
                                    context: {headers: {userId: user?.googleId}}
                                });
            onClose();
        } catch (e) {
            console.error(e)
        }
    };

    const balance = calculateUserBalance(expense);

    const categoryIcon = getCategoryIcon(expense.category);
    const categoryColor = getCategoryColor(expense.category);
    const categoryBg = useColorModeValue(
        getCategoryBg(expense.category, false),
        getCategoryBg(expense.category, true)
    );

    return (
        <>
            <Card
                bg={categoryBg}
                borderRadius="lg"
                boxShadow="md"
                border="1px"
                borderColor={borderColor}
                _hover={{boxShadow: 'lg', transform: 'translateY(-2px)'}}
                transition="all 0.2s"
                position="relative"
            >
                <CardBody pb={2}>
                    <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="center">
                            <HStack>
                                <Icon
                                    as={categoryIcon}
                                    color={categoryColor}
                                    boxSize={5}
                                />
                                <Badge
                                    colorScheme={expense.category.toLowerCase()}
                                    variant="subtle"
                                >
                                    {expense.category}
                                </Badge>
                            </HStack>
                        </Flex>
                        <Text fontSize="lg" fontWeight="bold" color="gray.700">
                            ${expense.amount.toFixed(2)}
                        </Text>
                        <Text fontSize="md" fontWeight="semibold" noOfLines={2}>
                            {expense.name}
                        </Text>

                        <HStack>
                            <Icon as={FaCalendarAlt} color="gray.400" boxSize={4}/>
                            <Text fontSize="sm" color="gray.500">
                                {new Date(expense.date).toLocaleDateString()}
                            </Text>
                        </HStack>

                        {expense.isShared && (
                            <>
                                <HStack>
                                    <Icon as={FaUsers} color="gray.400" boxSize={4}/>
                                    <AvatarGroup size="xs" max={3}>
                                        {expense.participants?.map((participant) => (
                                            <Avatar
                                                key={participant.userId}
                                                src={participant.user?.avatar}
                                                name={participant.user?.name}
                                            />
                                        ))}
                                    </AvatarGroup>
                                    <Text fontSize="xs" color="gray.500">
                                        {expense.participants?.length || 0} participants
                                    </Text>
                                </HStack>

                                <Stat>
                                    <StatLabel fontSize="xs">Your Balance</StatLabel>
                                    {balance.isOwed && (
                                        <>
                                            <StatNumber fontSize="md" color="green.500">
                                                +${balance.balance.toFixed(2)}
                                            </StatNumber>
                                            <StatHelpText fontSize="xs">
                                                <StatArrow type="increase"/>
                                                You are owed
                                            </StatHelpText>
                                        </>
                                    )}
                                    {balance.owes && (
                                        <>
                                            <StatNumber fontSize="md" color="red.500">
                                                -${balance.balance.toFixed(2)}
                                            </StatNumber>
                                            <StatHelpText fontSize="xs">
                                                <StatArrow type="decrease"/>
                                                You owe
                                            </StatHelpText>
                                        </>
                                    )}
                                    {!balance.isOwed && !balance.owes && (
                                        <>
                                            <StatNumber fontSize="md" color="gray.500">
                                                $0.00
                                            </StatNumber>
                                            <StatHelpText fontSize="xs">
                                                Settled
                                            </StatHelpText>
                                        </>
                                    )}
                                </Stat>

                                {/* Payment details */}
                                <VStack align="stretch" spacing={1}>
                                    <Text fontSize="xs" color="gray.500">
                                        You paid: ${balance.userPaid.toFixed(2)}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Your share: ${balance.userOwes.toFixed(2)}
                                    </Text>
                                </VStack>
                            </>
                        )}
                    </VStack>
                </CardBody>
                <Flex mt={4} align="center" justify="space-between">
                    {!expense.isShared ? (
                        <Badge colorScheme="blue" variant="outline" size="sm" ml={2}>
                            Personal Expense
                        </Badge>
                    ) : <span/>}
                    {user?.googleId === expense.userId && (
                        <IconButton
                            aria-label="Delete expense"
                            icon={<FaTrash/>}
                            size="md"
                            variant="ghost"
                            colorScheme="red"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpen();
                            }}
                        />
                    )}
                </Flex>
            </Card>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Expense
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete "{expense.name}"? This action cannot be
                            undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} variant="ghost">
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleDelete} ml={3}
                                    isLoading={deleting}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default ExpenseCard;
