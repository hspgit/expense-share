import gql from 'graphql-tag';

const friendshipTypeDefs = gql`
    type FriendRequest {
        from: User!
        to: User!
        status: FriendRequestStatus!
        createdAt: String!
        updatedAt: String!
    }

    enum FriendRequestStatus {
        PENDING
        ACCEPTED
        REJECTED
    }

    extend type User {
        friends: [User!]!
        incomingFriendRequests: [FriendRequest!]!
        outgoingFriendRequests: [FriendRequest!]!
    }

    extend type Mutation {
        sendFriendRequest(email: String!): FriendRequest!
        acceptFriendRequest(fromGoogleId: ID!): User!
        rejectFriendRequest(fromGoogleId: ID!): Boolean!
        cancelFriendRequest(toGoogleId: ID!): Boolean!
    }

    extend type Query {
        friendBalances: [FriendBalance!]!
    }

    type FriendBalance {
        friend: User!
        balance: Float!
        isSettled: Boolean!
    }
`;

export default friendshipTypeDefs;