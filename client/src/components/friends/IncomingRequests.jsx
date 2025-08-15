import React from 'react';
import {
    Avatar,
    Badge,
    Button,
    Card,
    CardBody,
    Divider,
    Flex,
    Heading,
    HStack,
    Icon,
    Spacer,
    Text,
    VStack,
} from '@chakra-ui/react';
import {FaCheck, FaTimes, FaUserFriends} from 'react-icons/fa';

function IncomingRequests({incomingRequests = [], onAccept, onReject, cardBg, borderColor}) {
    return (
        <Card bg={cardBg} border="1px" borderColor={borderColor} flex={1} width="100%">
            <CardBody>
                <VStack spacing={4} align="stretch" h="100%">
                    <HStack>
                        <Heading size="sm">Incoming Requests</Heading>
                        <Spacer/>
                        <Badge colorScheme="green">{incomingRequests.length}</Badge>
                    </HStack>
                    <Divider/>

                    {incomingRequests.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" flex={1}>
                            <Icon as={FaUserFriends} w={8} h={8} color="gray.400" mb={2}/>
                            <Text fontSize="sm" color="gray.500" textAlign="center">
                                No incoming requests
                            </Text>
                        </Flex>
                    ) : (
                         <VStack spacing={2} align="stretch" overflowY="auto" flex={1}>
                             {incomingRequests.map((request, index) => (
                                 <Card key={`${request.from.id}-${index}`} variant="outline"
                                       size="sm">
                                     <CardBody py={2}>
                                         <VStack spacing={2} align="stretch">
                                             <HStack>
                                                 <Avatar size="xs" name={request.from.name}
                                                         src={request.from.avatar}/>
                                                 <VStack align="start" spacing={0} flex={1}>
                                                     <Text fontSize="sm"
                                                           fontWeight="medium">{request.from.name}</Text>
                                                     <Text fontSize="xs"
                                                           color="gray.500">{request.from.email}</Text>
                                                 </VStack>
                                             </HStack>
                                             <HStack spacing={1}>
                                                 <Button
                                                     size="xs"
                                                     colorScheme="green"
                                                     leftIcon={<FaCheck/>}
                                                     onClick={() => onAccept(request)}
                                                     flex={1}
                                                 >
                                                     Accept
                                                 </Button>
                                                 <Button
                                                     size="xs"
                                                     colorScheme="red"
                                                     variant="outline"
                                                     leftIcon={<FaTimes/>}
                                                     onClick={() => onReject(request)}
                                                     flex={1}
                                                 >
                                                     Reject
                                                 </Button>
                                             </HStack>
                                         </VStack>
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

export default IncomingRequests;
