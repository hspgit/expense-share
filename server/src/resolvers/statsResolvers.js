const statsResolvers = {
    Query: {
        stats: async (_, __, {expensesCollection, userId}) => {
            if (!userId) {
                throw new Error('Authentication required');
            }

            const now = new Date();
            const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

            const currentMonthExpenses = await expensesCollection
                .find({
                          $or: [
                              {userId},
                              {'participants.userId': userId}
                          ],
                          date: {$gte: firstDayCurrentMonth.toISOString().split('T')[0]}
                      })
                .toArray();

            const lastMonthExpenses = await expensesCollection
                .find({
                          $or: [
                              {userId},
                              {'participants.userId': userId}
                          ],
                          date: {
                              $gte: firstDayLastMonth.toISOString().split('T')[0],
                              $lte: lastDayLastMonth.toISOString().split('T')[0]
                          }
                      })
                .toArray();

            const allExpenses = await expensesCollection
                .find({
                          $or: [
                              {userId},
                              {'participants.userId': userId}
                          ]
                      })
                .toArray();

            const totalCurrentMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount,
                                                                  0);
            const totalLastMonth = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            const totalMonthlyChange = lastMonthExpenses.length > 0
                                       ? ((totalCurrentMonth - totalLastMonth) / totalLastMonth)
                                         * 100
                                       : 0;

            const currentMonthSharedExpenses = currentMonthExpenses.filter(exp => exp.isShared);
            const lastMonthSharedExpenses = lastMonthExpenses.filter(exp => exp.isShared);

            const sharedTotalCurrentMonth = currentMonthSharedExpenses.reduce(
                (sum, exp) => sum + exp.amount, 0);
            const sharedTotalLastMonth = lastMonthSharedExpenses.reduce(
                (sum, exp) => sum + exp.amount, 0);
            const sharedMonthlyChange = lastMonthSharedExpenses.length > 0
                                        ? ((sharedTotalCurrentMonth - sharedTotalLastMonth)
                                           / sharedTotalLastMonth) * 100
                                        : 0;

            const categoryMap = {};
            const totalAmount = allExpenses.reduce((sum, exp) => {
                const category = exp.category || 'Uncategorized';
                if (!categoryMap[category]) {
                    categoryMap[category] = 0;
                }
                categoryMap[category] += exp.amount;
                return sum + exp.amount;
            }, 0);

            const expensesByCategory = Object.keys(categoryMap).map(category => ({
                name: category,
                amount: categoryMap[category],
                percentage: (categoryMap[category] / totalAmount) * 100
            }));

            const friendsWithActivity = await expensesCollection
                .aggregate([
                               {
                                   $match: {
                                       'participants.userId': userId,
                                       date: {
                                           $gte: firstDayCurrentMonth.toISOString().split('T')[0]
                                       }
                                   }
                               },
                               {
                                   $project: {
                                       participants: {
                                           $filter: {
                                               input: '$participants',
                                               as: 'participant',
                                               cond: {$ne: ['$$participant.userId', userId]}
                                           }
                                       }
                                   }
                               },
                               {$unwind: '$participants'},
                               {$group: {_id: '$participants.userId'}},
                               {$count: 'activeCount'}
                           ])
                .toArray();

            const friendsWithActivityLastMonth = await expensesCollection
                .aggregate([
                               {
                                   $match: {
                                       'participants.userId': userId,
                                       date: {
                                           $gte: firstDayLastMonth.toISOString().split('T')[0],
                                           $lt: firstDayCurrentMonth.toISOString().split('T')[0]
                                       }
                                   }
                               },
                               {
                                   $project: {
                                       participants: {
                                           $filter: {
                                               input: '$participants',
                                               as: 'participant',
                                               cond: {$ne: ['$$participant.userId', userId]}
                                           }
                                       }
                                   }
                               },
                               {$unwind: '$participants'},
                               {$group: {_id: '$participants.userId'}},
                               {$count: 'activeCount'}
                           ])
                .toArray();

            const activeCount = friendsWithActivity.length > 0 ? friendsWithActivity[0].activeCount
                                                               : 0;
            const activeLastMonth = friendsWithActivityLastMonth.length > 0
                                    ? friendsWithActivityLastMonth[0].activeCount : 0;
            const newThisMonth = Math.max(activeCount - activeLastMonth, 0);

            return {
                totalExpenses: {
                    totalAmount: totalCurrentMonth,
                    monthlyChange: totalMonthlyChange
                },
                sharedExpenses: {
                    totalAmount: sharedTotalCurrentMonth,
                    monthlyChange: sharedMonthlyChange
                },
                friendsActivity: {
                    activeCount,
                    newThisMonth
                },
                expensesByCategory
            };
        }
    }
};

export default statsResolvers;
