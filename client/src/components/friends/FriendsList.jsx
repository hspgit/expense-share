import React, {useEffect} from 'react';
import {
    Avatar,
    Badge,
    Card,
    CardBody,
    Divider,
    Flex,
    Heading,
    HStack,
    Icon,
    Spacer,
    Stat,
    StatArrow,
    StatHelpText,
    StatNumber,
    Text,
    VStack,
} from '@chakra-ui/react';
import {FaUserFriends} from 'react-icons/fa';
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag';

const GET_FRIEND_BALANCES = gql`
    query GetFriendBalances {
        friendBalances {
            friend {
                id
                name
                avatar
            }
            balance
            isSettled
        }
    }
`;

function FriendsList({cardBg, borderColor}) {
    const {data, loading, error, refetch} = useQuery(GET_FRIEND_BALANCES, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        refetch().then()
    }, [refetch]);

    if (loading) {
        return <Text>Loading...</Text>;
    }
    if (error) {
        return <Text>Error loading friends: {error.message}</Text>;
    }

    const friends = data.friendBalances;

    return (
        <Card bg={cardBg} border="1px" borderColor={borderColor} h="100%">
            <CardBody>
                <VStack spacing={4} align="stretch" h="100%">
                    <HStack>
                        <Heading size="md">Current Friends</Heading>
                        <Spacer/>
                        <Badge colorScheme="blue">{friends.length}</Badge>
                    </HStack>
                    <Divider/>

                    {friends.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" flex={1}>
                            <Icon as={FaUserFriends} w={12} h={12} color="gray.400" mb={4}/>
                            <Text fontSize="lg" color="gray.500" mb={2}>
                                No friends yet
                            </Text>
                            <Text color="gray.400" textAlign="center">
                                Add friends to start sharing expenses together
                            </Text>
                        </Flex>
                    ) : (
                         <VStack spacing={3} align="stretch" overflowY="auto" flex={1}>
                             {friends.map(({friend, balance, isSettled}) => (
                                 <Card key={friend.id} variant="outline">
                                     <CardBody py={3}>
                                         <HStack>
                                             <Avatar
                                                 size="sm"
                                                 name={friend.name}
                                                 src={friend.avatar}
                                                 bg="blue.500"
                                             />
                                             <VStack align="start" spacing={0} flex={1}>
                                                 <Text fontWeight="medium">{friend.name}</Text>
                                             </VStack>
                                             <Stat>
                                                 <StatNumber fontSize="md"
                                                             color={isSettled ? "gray.400"
                                                                              : (balance > 0)
                                                                                ? 'green.500'
                                                                                : 'red.500'}>
                                                     {isSettled ? '' : (balance > 0) ? '+'
                                                                                     : '-'}${Math.abs(
                                                     balance).toFixed(2)}
                                                 </StatNumber>
                                                 <StatHelpText
                                                     color={isSettled ? "gray.400" : "inherit"}>
                                                     {isSettled ? (
                                                         "Settled"
                                                     ) : (
                                                          <>
                                                              <StatArrow
                                                                  type={(balance > 0) ? 'increase'
                                                                                      : 'decrease'}/>
                                                              {(balance > 0)
                                                               ? 'You receive'
                                                               : 'You pay'}
                                                          </>
                                                      )}
                                                 </StatHelpText>
                                             </Stat>
                                         </HStack>
                                     </CardBody>
                                 </Card>
                             ))}
                         </VStack>
                     )}
                </VStack>
            </CardBody>
        </Card>
    );
}

export default FriendsList;
