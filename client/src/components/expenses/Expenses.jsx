import React, {useState} from 'react';
import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import ExpenseForm from './ExpenseForm.jsx';
import ExpenseList from './ExpenseList.jsx';
import {
    FaChevronDown,
    FaFilm,
    FaHospital,
    FaList,
    FaPlane,
    FaPlus,
    FaReceipt,
    FaShoppingBag,
    FaUserFriends,
    FaUtensils
} from "react-icons/fa";
import {FaPerson} from 'react-icons/fa6';
import {GiMoneyStack} from 'react-icons/gi';

function Expenses({user}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedShareType, setSelectedShareType] = useState('All');

    const categoryOptions = [
        {
            value: 'All',
            label: 'All Categories',
            icon: GiMoneyStack,
            color: 'red.500',
            boxSize: 7
        },
        {value: 'Food', label: 'Food', icon: FaUtensils, color: 'green.500', boxSize: 5},
        {value: 'Travel', label: 'Travel', icon: FaPlane, color: 'blue.500', boxSize: 5},
        {
            value: 'Shopping',
            label: 'Shopping',
            icon: FaShoppingBag,
            color: 'purple.500',
            boxSize: 5
        },
        {
            value: 'Entertainment',
            label: 'Entertainment',
            icon: FaFilm,
            color: 'pink.500',
            boxSize: 5
        },
        {
            value: 'Healthcare',
            label: 'Healthcare',
            icon: FaHospital,
            color: 'yellow.500',
            boxSize: 5
        },
        {value: 'Other', label: 'Other', icon: FaList, color: 'gray.500', boxSize: 5},
    ];

    const shareOptions = [
        {value: 'All', label: 'All Types', icon: FaList, color: 'gray.500'},
        {value: 'Shared', label: 'Shared', icon: FaUserFriends, color: 'blue.500'},
        {value: 'Personal', label: 'Personal', icon: FaPerson, color: 'teal.500'}
    ];

    const getSelectedCategoryData = () => categoryOptions.find(c => c.value === selectedCategory);
    const getSelectedShareData = () => shareOptions.find(s => s.value === selectedShareType);

    return (
        <Box px={8} py={8} mx={0}>
            <HStack spacing={3} align="center" mb={4}>
                <Icon as={FaReceipt} color="blue.500" boxSize={6}/>
                <Heading size="lg" color="blue.600">Your Expenses</Heading>
                <Spacer/>
                <HStack spacing={3} w={{base: '100%', md: 'auto'}}>
                    <Box w={{base: '50%', md: '240px'}}>
                        <Menu matchWidth>
                            <MenuButton
                                as={Button}
                                rightIcon={<FaChevronDown/>}
                                variant="outline"
                                w="full"
                                justifyContent="space-between"
                            >
                                {getSelectedCategoryData() ? (
                                    <HStack spacing={2}>
                                        <Icon as={getSelectedCategoryData().icon}
                                              color={getSelectedCategoryData().color}
                                              boxSize={getSelectedCategoryData().boxSize || 5}/>
                                        <Box as="span"
                                             isTruncated>{getSelectedCategoryData().label}</Box>
                                    </HStack>
                                ) : 'Category'}
                            </MenuButton>
                            <MenuList maxH="300px" overflowY="auto">
                                {categoryOptions.map(opt => (
                                    <MenuItem key={opt.value}
                                              onClick={() => setSelectedCategory(opt.value)}>
                                        <HStack spacing={3}>
                                            <Icon as={opt.icon} color={opt.color}
                                                  boxSize={opt.boxSize || 5}/>
                                            <Text>{opt.label}</Text>
                                        </HStack>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                    <Box w={{base: '50%', md: '200px'}}>
                        <Menu matchWidth>
                            <MenuButton
                                as={Button}
                                rightIcon={<FaChevronDown/>}
                                variant="outline"
                                w="full"
                                justifyContent="space-between"
                            >
                                {getSelectedShareData() ? (
                                    <HStack spacing={2}>
                                        <Icon as={getSelectedShareData().icon}
                                              color={getSelectedShareData().color}/>
                                        <Box as="span"
                                             isTruncated>{getSelectedShareData().label}</Box>
                                    </HStack>
                                ) : 'Type'}
                            </MenuButton>
                            <MenuList>
                                {shareOptions.map(opt => (
                                    <MenuItem key={opt.value}
                                              onClick={() => setSelectedShareType(opt.value)}>
                                        <HStack spacing={3}>
                                            <Icon as={opt.icon} color={opt.color}/>
                                            <Text>{opt.label}</Text>
                                        </HStack>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                </HStack>
            </HStack>
            <Button
                onClick={() => {
                    isOpen ? onClose() : onOpen()
                }}
                position="fixed"
                colorScheme="teal"
                bottom={10}
                right={10}
                zIndex={100}
                leftIcon={<FaPlus/>}
                _hover={{
                    transform: "scale(1.05)",
                    animation: "jiggle 0.5s ease-in-out"
                }}
                transition="all 0.2s ease"
                sx={{
                    "@keyframes jiggle": {
                        "0%": {transform: "scale(1.05) rotate(0deg)"},
                        "25%": {transform: "scale(1.05) rotate(-3deg)"},
                        "50%": {transform: "scale(1.05) rotate(3deg)"},
                        "75%": {transform: "scale(1.05) rotate(-3deg)"},
                        "100%": {transform: "scale(1.05) rotate(0deg)"}
                    }
                }}
            >
                Add expense
            </Button>
            <ExpenseList user={user} selectedCategory={selectedCategory}
                         selectedShareType={selectedShareType}/>
            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Add Expense</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <ExpenseForm closeModal={onClose} user={user}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Expenses;
