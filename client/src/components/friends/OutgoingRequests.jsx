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
import {FaClock, FaTimes} from 'react-icons/fa';

function OutgoingRequests({outgoingRequests = [], onCancel, cardBg, borderColor}) {
    return (
        <Card bg={cardBg} border="1px" borderColor={borderColor} flex={1} width="100%">
            <CardBody>
                <VStack spacing={4} align="stretch" h="100%">
                    <HStack>
                        <Heading size="sm">Outgoing Requests</Heading>
                        <Spacer/>
                        <Badge colorScheme="orange">{outgoingRequests.length}</Badge>
                    </HStack>
                    <Divider/>

                    {outgoingRequests.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" flex={1}>
                            <Icon as={FaClock} w={8} h={8} color="gray.400" mb={2}/>
                            <Text fontSize="sm" color="gray.500" textAlign="center">
                                No pending requests
                            </Text>
                        </Flex>
                    ) : (
                         <VStack spacing={2} align="stretch" overflowY="auto" flex={1}>
                             {outgoingRequests.map((request, index) => (
                                 <Card key={`${request.to.id}-${index}`} variant="outline"
                                       size="sm">
                                     <CardBody py={2}>
                                         <VStack spacing={2} align="stretch">
                                             <HStack>
                                                 <Avatar size="xs" name={request.to.name}
                                                         src={request.to.avatar}/>
                                                 <VStack align="start" spacing={0} flex={1}>
                                                     <Text fontSize="sm"
                                                           fontWeight="medium">{request.to.name}</Text>
                                                     <Text fontSize="xs"
                                                           color="gray.500">{request.to.email}</Text>
                                                 </VStack>
                                                 <Badge size="sm"
                                                        colorScheme="orange">Pending</Badge>
                                             </HStack>
                                             <Button
                                                 size="xs"
                                                 colorScheme="red"
                                                 variant="outline"
                                                 leftIcon={<FaTimes/>}
                                                 onClick={() => onCancel(request)}
                                                 w="full"
                                             >
                                                 Cancel
                                             </Button>
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

export default OutgoingRequests;
