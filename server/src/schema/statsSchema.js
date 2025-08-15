import gql from 'graphql-tag';

const statsTypeDefs = gql`
    type ExpenseStats {
        totalAmount: Float!
        monthlyChange: Float!
    }

    type SharedExpenseStats {
        totalAmount: Float!
        monthlyChange: Float!
    }

    type FriendsActivityStats {
        activeCount: Int!
        newThisMonth: Int!
    }

    type CategoryStats {
        name: String!
        amount: Float!
        percentage: Float!
    }

    type Stats {
        totalExpenses: ExpenseStats!
        sharedExpenses: SharedExpenseStats!
        friendsActivity: FriendsActivityStats!
        expensesByCategory: [CategoryStats!]!
    }

    extend type Query {
        stats: Stats!
    }
`;

export default statsTypeDefs;
