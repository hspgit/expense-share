import React, {useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import {FaPlus, FaUserFriends} from 'react-icons/fa';
import {gql, useMutation, useQuery} from '@apollo/client';

import FriendsList from './FriendsList';
import IncomingRequests from './IncomingRequests';
import OutgoingRequests from './OutgoingRequests';

const GET_FRIENDS_DATA = gql`
    query GetFriendsData($userId: ID!) {
        user(id: $userId) {
            id
            friends {
                id
                name
                email
                avatar
            }
            incomingFriendRequests {
                from {
                    id
                    name
                    email
                    avatar
                }
                createdAt
            }
            outgoingFriendRequests {
                to {
                    id
                    name
                    email
                    avatar
                }
                createdAt
            }
        }
    }
`;

const SEND_FRIEND_REQUEST = gql`
    mutation SendFriendRequest($email: String!) {
        sendFriendRequest(email: $email) {
            to {
                id
                name
                email
            }
        }
    }
`;

const ACCEPT_FRIEND_REQUEST = gql`
    mutation AcceptFriendRequest($fromGoogleId: ID!) {
        acceptFriendRequest(fromGoogleId: $fromGoogleId) {
            id
            name
            email
        }
    }
`;

const REJECT_FRIEND_REQUEST = gql`
    mutation RejectFriendRequest($fromGoogleId: ID!) {
        rejectFriendRequest(fromGoogleId: $fromGoogleId)
    }
`;

const CANCEL_FRIEND_REQUEST = gql`
    mutation CancelFriendRequest($toGoogleId: ID!) {
        cancelFriendRequest(toGoogleId: $toGoogleId)
    }
`;

function Friends({userId}) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [email, setEmail] = useState('');
    const toast = useToast();

    const {data, loading, error, refetch} = useQuery(GET_FRIENDS_DATA, {
        variables: {userId},
        skip: !userId,
    });

    const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
        onCompleted: () => {
            toast({
                      title: "Friend request sent",
                      description: `Friend request sent to ${email}`,
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                  });
            setEmail('');
            onClose();
            refetch();
        },
        onError: (error) => {
            toast({
                      title: "Error",
                      description: error.message,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                  });
        },
    });

    const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
        onCompleted: () => {
            toast({
                      title: "Friend request accepted",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                  });
            refetch();
        },
    });

    const [rejectFriendRequest] = useMutation(REJECT_FRIEND_REQUEST, {
        onCompleted: () => {
            toast({
                      title: "Friend request rejected",
                      status: "info",
                      duration: 3000,
                      isClosable: true,
                  });
            refetch();
        },
    });

    const [cancelFriendRequest] = useMutation(CANCEL_FRIEND_REQUEST, {
        onCompleted: () => {
            toast({
                      title: "Friend request cancelled",
                      status: "info",
                      duration: 3000,
                      isClosable: true,
                  });
            refetch();
        },
    });

    const handleAddFriend = () => {
        if (!email.trim()) {
            toast({
                      title: "Email required",
                      description: "Please enter a valid email address",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                  });
            return;
        }

        sendFriendRequest({variables: {email}});
    };

    const handleAcceptRequest = (request) => {
        acceptFriendRequest({variables: {fromGoogleId: request.from.id}});
    };

    const handleRejectRequest = (request) => {
        rejectFriendRequest({variables: {fromGoogleId: request.from.id}});
    };

    const handleCancelRequest = (request) => {
        cancelFriendRequest({variables: {toGoogleId: request.to.id}});
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }
    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    const friends = data?.user?.friends || [];
    const incomingRequests = data?.user?.incomingFriendRequests || [];
    const outgoingRequests = data?.user?.outgoingFriendRequests || [];

    return (
        <Box px={8} py={8} w="100%" maxW="none" mx={0}
             h="100vh"
             display="flex" flexDirection="column"
             overflowY="hidden"
             sx={{
                 '@media (max-height: 750px)': {
                     overflowY: 'auto'
                 }
             }}
        >
            <HStack spacing={3} align="center" mb={4}>
                <Icon as={FaUserFriends} color="blue.500" boxSize={6}/>
                <Heading size="lg" color="blue.600">
                    Your Friends
                </Heading>
            </HStack>

            <Grid templateColumns={{base: "1fr", md: "1fr 1fr", lg: "2fr 1fr"}} gap={8} flex="1">
                <GridItem>
                    <FriendsList
                        friends={friends}
                        cardBg={cardBg}
                        borderColor={borderColor}
                    />
                </GridItem>

                <GridItem>
                    <VStack spacing={4} h="100%" align="stretch">
                        <Button
                            leftIcon={<FaPlus/>}
                            colorScheme="blue"
                            size="lg"
                            w="full"
                            bgGradient='linear(to-r, gray.300, yellow.400, pink.200)'
                            onClick={onOpen}
                        >
                            Add Friend
                        </Button>

                        <IncomingRequests
                            incomingRequests={incomingRequests}
                            onAccept={handleAcceptRequest}
                            onReject={handleRejectRequest}
                            cardBg={cardBg}
                            borderColor={borderColor}
                        />

                        <OutgoingRequests
                            outgoingRequests={outgoingRequests}
                            onCancel={handleCancelRequest}
                            cardBg={cardBg}
                            borderColor={borderColor}
                        />
                    </VStack>
                </GridItem>
            </Grid>

            {/* Add Friend Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Add Friend</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                placeholder="Enter friend's email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddFriend();
                                    }
                                }}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleAddFriend}
                        >
                            Send Friend Request
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Friends;
