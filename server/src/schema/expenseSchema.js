import gql from 'graphql-tag';

const expenseTypeDefs = gql`
    type Expense {
        id: ID!
        userId: String!
        category: String!
        name: String!
        amount: Float!
        date: String!
        createdAt: String!
        isShared: Boolean!
        paidBy: String
        participants: [ExpenseParticipant!]
    }

    type ExpenseParticipant {
        userId: String!
        user: User!
        amount: Float!
    }

    input CreateExpenseInput {
        category: String!
        name: String!
        amount: Float!
        date: String!
        isShared: Boolean!
        paidBy: String
        participants: [ExpenseParticipantInput!]
    }

    input ExpenseParticipantInput {
        userId: String!
        amount: Float!
    }

    extend type Query {
        expenses: [Expense!]!
    }
    
    extend type Mutation {
        createExpense(input: CreateExpenseInput!): Expense!
        deleteExpense(id: ID!): Boolean!
    }
`;

export default expenseTypeDefs;