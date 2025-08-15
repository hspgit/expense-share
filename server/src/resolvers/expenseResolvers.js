import {ObjectId} from 'mongodb';

const expenseResolvers = {
    Query: {
        expenses: async (_, __, {expensesCollection, userId}) => {
            if (!userId) {
                throw new Error('Authentication required');
            }
            const expenses = await expensesCollection
                .find({
                          $or: [
                              {userId: userId},
                              {'participants.userId': userId}
                          ]
                      })
                .sort({createdAt: -1})
                .toArray();
            return expenses.map(exp => ({
                ...exp,
                id: exp._id.toString(),
            }));
        },
    },
    Mutation: {
        createExpense: async (_, {input}, {expensesCollection, usersCollection, userId}) => {
            if (!userId) {
                throw new Error('Authentication required');
            }

            const newExpense = {
                userId,
                category: input.category,
                name: input.name,
                amount: input.amount,
                date: input.date,
                createdAt: new Date().toISOString(),
                isShared: input.isShared || false,
            };

            if (input.isShared) {
                newExpense.paidBy = input.paidBy || userId;
                newExpense.participants = input.participants || [];
            }

            const result = await expensesCollection.insertOne(newExpense);
            return {...newExpense, id: result.insertedId.toString()};
        },
        deleteExpense: async (_, {id}, {expensesCollection, userId}) => {
            if (!userId) {
                throw new Error('Authentication required');
            }
            const expense = await expensesCollection.findOne({_id: new ObjectId(id)});
            if (!expense) {
                throw new Error('Expense not found');
            }
            if (expense.userId !== userId) {
                throw new Error('Not authorized to delete this expense');
            }
            const result = await expensesCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        }
    },
    Expense: {
        participants: async (parent, _, {usersCollection}) => {
            if (!parent.participants || parent.participants.length === 0) {
                return [];
            }

            try {
                const participantsWithUsers = await Promise.all(
                    parent.participants.map(async (participant) => {
                        try {
                            const user = await usersCollection.findOne(
                                {googleId: participant.userId});
                            if (!user || !user.username || !user.email) {
                                console.warn(
                                    `User not found or incomplete for googleId: ${participant.userId}`);
                                return null;
                            }
                            return {
                                userId: participant.userId,
                                user: {
                                    id: user.googleId,
                                    googleId: user.googleId.toString(),
                                    name: user.username,
                                    username: user.username,
                                    email: user.email,
                                    avatar: user.avatar || null,
                                    createdAt: user.createdAt
                                },
                                amount: participant.amount
                            };
                        } catch (userError) {
                            console.error(`Error fetching user ${participant.userId}:`, userError);
                            return null;
                        }
                    })
                );

                return participantsWithUsers.filter(participant => participant !== null);
            } catch (error) {
                console.error('Error resolving participants:', error);
                return [];
            }
        }
    }
};

export default expenseResolvers;
