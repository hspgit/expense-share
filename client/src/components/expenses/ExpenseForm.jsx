import React, {useState} from 'react';
import {gql, useMutation, useQuery} from '@apollo/client';
import {
    Alert,
    AlertIcon,
    Avatar,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Collapse,
    Divider,
    FormControl,
    FormLabel,
    HStack,
    Icon,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    NumberInput,
    NumberInputField,
    Radio,
    RadioGroup,
    Text,
    useColorModeValue,
    useToast,
    VStack,
    Tooltip
} from '@chakra-ui/react';
import {
    FaChevronDown,
    FaFilm,
    FaHospital,
    FaList,
    FaPlane,
    FaShoppingBag,
    FaUtensils
} from 'react-icons/fa';

const CREATE_EXPENSE = gql`
    mutation CreateExpense($input: CreateExpenseInput!) {
        createExpense(input: $input) {
            id
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

const GET_FRIENDS = gql`
    query GetFriendsData($userId: ID!) {
        user(id: $userId) {
            id
            friends {
                id
                name
                email
                avatar
            }
        }
    }
`;

function ExpenseForm({closeModal, user, onExpenseCreated}) {
    const [form, setForm] = useState({
                                         category: '',
                                         name: '',
                                         amount: '',
                                         date: new Date().toISOString().split('T')[0],
                                     });

    const [isShared, setIsShared] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [paidBy, setPaidBy] = useState(user?.googleId);
    const [customAmounts, setCustomAmounts] = useState({});

    const toast = useToast();
    const [createExpense, {loading}] = useMutation(CREATE_EXPENSE, {
        refetchQueries: [{query: GET_EXPENSES}],
        awaitRefetchQueries: true,
    });

    const {data: friendsData} = useQuery(GET_FRIENDS, {
        variables: {userId: user?.googleId},
        skip: !user?.googleId,
    });

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const categoryOptions = [
        {value: 'Food', label: 'Food', icon: FaUtensils, color: 'green.500'},
        {value: 'Travel', label: 'Travel', icon: FaPlane, color: 'blue.500'},
        {value: 'Shopping', label: 'Shopping', icon: FaShoppingBag, color: 'purple.500'},
        {value: 'Entertainment', label: 'Entertainment', icon: FaFilm, color: 'pink.500'},
        {value: 'Healthcare', label: 'Healthcare', icon: FaHospital, color: 'yellow.500'},
        {value: 'Other', label: 'Other', icon: FaList, color: 'gray.500'},
    ];

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleFriendSelect = (selectedFriendIds) => {
        const selected = friendOptions.filter(friend => selectedFriendIds.includes(friend.value));
        setSelectedFriends(selected);
        setCustomAmounts({});
    };

    const handleCustomAmountChange = (friendId, amount) => {
        setCustomAmounts(prev => ({
            ...prev,
            [friendId]: amount
        }));
    };

    const handleCategorySelect = (category) => {
        setForm({...form, category});
    };

    const getSelectedCategoryData = () => {
        return categoryOptions.find(option => option.value === form.category);
    };

    const validateAmounts = () => {
        if (!isShared || selectedFriends.length === 0) {
            return true;
        }

        const totalParticipants = selectedFriends.length + 1; // +1 for the current user
        const currentUserAmount = customAmounts[user?.googleId] ||
                                  (form.amount ? parseFloat(form.amount) / totalParticipants : 0);

        const totalCustom = selectedFriends.reduce((sum, friend) => {
            const amount = customAmounts[friend.value] ||
                           (form.amount ? parseFloat(form.amount) / totalParticipants : 0);
            return sum + parseFloat(amount || 0);
        }, 0) + parseFloat(currentUserAmount || 0);

        return Math.abs(totalCustom - parseFloat(form.amount || 0)) < 0.01;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isShared && !validateAmounts()) {
            toast({
                      title: 'Invalid amounts',
                      description: 'Split amounts must add up to the total expense amount',
                      status: 'error',
                      duration: 3000
                  });
            return;
        }

        try {
            const expenseInput = {
                ...form,
                amount: parseFloat(form.amount),
                isShared,
            };

            if (isShared) {
                expenseInput.paidBy = paidBy;

                const totalParticipants = selectedFriends.length + 1;
                const participants = [];

                participants.push({
                                      userId: user.googleId,
                                      amount: parseFloat(customAmounts[user.googleId] ||
                                                         (form.amount ? parseFloat(form.amount)
                                                                        / totalParticipants : 0))
                                  });

                selectedFriends.forEach(friend => {
                    participants.push({
                                          userId: friend.value,
                                          amount: parseFloat(customAmounts[friend.value] ||
                                                             (form.amount ? parseFloat(form.amount)
                                                                            / totalParticipants
                                                                          : 0))
                                      });
                });

                expenseInput.participants = participants;
            }

            await createExpense({
                                    variables: {input: expenseInput},
                                    context: {
                                        headers: {userId: user.googleId},
                                    },
                                });

            toast({title: 'Expense created!', status: 'success', duration: 2000});
            closeModal()

            setForm(
                {category: '', name: '', amount: '', date: new Date().toISOString().split('T')[0]});
            setIsShared(false);
            setSelectedFriends([]);
            setPaidBy(user.googleId);
            setCustomAmounts({});

            if (onExpenseCreated) {
                onExpenseCreated();
            }
        } catch (err) {
            toast({title: err.message, status: 'error', duration: 3000});
        }
    };

    const friendOptions = friendsData?.user?.friends?.map(friend => ({
        value: friend.id,
        label: friend.name,
        avatar: friend.avatar,
        email: friend.email
    })) || [];

    return (
        <Box
            bg={cardBg}
            p={6}
            mb={6}
        >
            <VStack spacing={4} align="stretch">

                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel fontWeight="semibold">Category</FormLabel>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<FaChevronDown/>}
                                    textAlign="left"
                                    variant="outline"
                                    w="full"
                                    justifyContent="space-between"
                                    bg={useColorModeValue('white', 'gray.800')}
                                    borderColor={borderColor}
                                    _hover={{borderColor: 'blue.300'}}
                                    _focus={{
                                        borderColor: 'blue.500',
                                        boxShadow: '0 0 0 1px #3182ce'
                                    }}
                                >
                                    {form.category ? (
                                        <HStack spacing={2}>
                                            <Icon
                                                as={getSelectedCategoryData()?.icon}
                                                color={getSelectedCategoryData()?.color}
                                            />
                                            <Text>{getSelectedCategoryData()?.label}</Text>
                                        </HStack>
                                    ) : (
                                         <Text color="gray.500">Select a category</Text>
                                     )}
                                </MenuButton>
                                <MenuList>
                                    {categoryOptions.map(option => (
                                        <MenuItem
                                            key={option.value}
                                            onClick={() => handleCategorySelect(option.value)}
                                        >
                                            <HStack spacing={3}>
                                                <Icon as={option.icon} color={option.color}/>
                                                <Text>{option.label}</Text>
                                            </HStack>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel fontWeight="semibold">Expense Name</FormLabel>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter expense description"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel fontWeight="semibold">Amount ($)</FormLabel>
                            <Input
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel fontWeight="semibold">Date</FormLabel>
                            <Input
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl>
                            <Tooltip
                                isDisabled={friendOptions.length > 0}
                                label="Add friends to share expenses"
                                shouldWrapChildren
                                hasArrow
                                placement="top"
                            >
                                <Checkbox
                                    isChecked={isShared}
                                    onChange={(e) => setIsShared(e.target.checked)}
                                    colorScheme="blue"
                                    isDisabled={friendOptions.length === 0}
                                >
                                    Share this expense with friends
                                </Checkbox>
                            </Tooltip>

                        </FormControl>

                        <Collapse in={isShared} animateOpacity>
                            <VStack spacing={4} align="stretch">
                                <Divider/>

                                <HStack align="start" spacing={6}>
                                    <FormControl flex={1}>
                                        <FormLabel fontWeight="semibold">Select Friends</FormLabel>
                                        <CheckboxGroup
                                            value={selectedFriends.map(f => f.value)}
                                            onChange={handleFriendSelect}
                                        >
                                            <VStack align="start" spacing={2}>
                                                {friendOptions.map(friend => (
                                                    <Checkbox key={friend.value}
                                                              value={friend.value}>
                                                        <HStack>
                                                            <Avatar size="sm" src={friend.avatar}
                                                                    name={friend.label}/>
                                                            <Text>{friend.label}</Text>
                                                        </HStack>
                                                    </Checkbox>
                                                ))}
                                            </VStack>
                                        </CheckboxGroup>
                                    </FormControl>

                                    {selectedFriends.length > 0 && (
                                        <FormControl flex={1}>
                                            <FormLabel fontWeight="semibold">Who paid for this
                                                expense?</FormLabel>
                                            <RadioGroup value={paidBy} onChange={setPaidBy}>
                                                <VStack align="start">
                                                    <Radio value={user.googleId}>You</Radio>
                                                    {selectedFriends.map(friend => (
                                                        <Radio key={friend.value}
                                                               value={friend.value}>
                                                            {friend.label}
                                                        </Radio>
                                                    ))}
                                                </VStack>
                                            </RadioGroup>
                                        </FormControl>
                                    )}
                                </HStack>

                                {selectedFriends.length > 0 && (
                                    <FormControl>
                                        <FormLabel fontWeight="semibold">Split amounts</FormLabel>
                                        <VStack align="stretch" spacing={3}>
                                            {/* Current user's split amount */}
                                            <HStack>
                                                <Avatar size="sm" src={user?.avatar}
                                                        name={user?.name || "You"}/>
                                                <Text minW="100px">You</Text>
                                                <NumberInput
                                                    value={customAmounts[user?.googleId]
                                                           || (form.amount ? (parseFloat(
                                                            form.amount) / (selectedFriends.length
                                                                            + 1)).toFixed(2) : '')}
                                                    onChange={(value) => handleCustomAmountChange(
                                                        user?.googleId, value)}
                                                    min={0}
                                                    precision={2}
                                                    step={0.01}
                                                    size="sm"
                                                    flex={1}
                                                >
                                                    <NumberInputField placeholder="0.00"/>
                                                </NumberInput>
                                            </HStack>

                                            {/* Friends' split amounts */}
                                            {selectedFriends.map(friend => (
                                                <HStack key={friend.value}>
                                                    <Avatar size="sm" src={friend.avatar}
                                                            name={friend.label}/>
                                                    <Text minW="100px">{friend.label}</Text>
                                                    <NumberInput
                                                        value={customAmounts[friend.value]
                                                               || (form.amount ? (parseFloat(
                                                                                      form.amount)
                                                                                  / (selectedFriends.length
                                                                                     + 1)).toFixed(
                                                                2) : '')}
                                                        onChange={(value) => handleCustomAmountChange(
                                                            friend.value, value)}
                                                        min={0}
                                                        precision={2}
                                                        step={0.01}
                                                        size="sm"
                                                        flex={1}
                                                    >
                                                        <NumberInputField placeholder="0.00"/>
                                                    </NumberInput>
                                                </HStack>
                                            ))}

                                            {!validateAmounts() && form.amount && (
                                                <Alert status="warning" size="sm">
                                                    <AlertIcon/>
                                                    Amounts must add up to ${form.amount || '0.00'}
                                                </Alert>
                                            )}
                                        </VStack>
                                    </FormControl>
                                )}
                            </VStack>
                        </Collapse>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            isLoading={loading}
                            loadingText="Adding..."
                            w="full"
                            mt={4}
                            bgGradient='linear(to-r, gray.300, yellow.400, pink.200)'
                        >
                            Add Expense
                        </Button>
                    </VStack>
                </form>
            </VStack>
        </Box>
    );
}

export default ExpenseForm;
