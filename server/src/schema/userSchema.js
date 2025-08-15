import gql from 'graphql-tag';

const userTypeDefs = gql`
    type User {
        id: ID!
        googleId: ID!
        name: String!
        username: String!
        email: String!
        avatar: String
        createdAt: String!
    }

    input CreateUserInput {
        googleId: ID!
        username: String!
        email: String!
        createdAt: String!
        avatar: String
    }

    extend type Query {
        users: [User!]!
        user(id: ID!): User
        userByGoogleId(googleId: ID!): User
    }

    extend type Mutation {
        createUser(input: CreateUserInput!): User!
        deleteUser(googleId: ID!): Boolean!
    }
`;

export default userTypeDefs;