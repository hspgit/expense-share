const friendshipResolvers = {
    User: {
        friends: async (parent, _, {usersCollection, friendshipsCollection}) => {
            const userFriendships = await friendshipsCollection.find({
                                                                         $or: [
                                                                             {user1Id: parent.googleId},
                                                                             {user2Id: parent.googleId}
                                                                         ]
                                                                     }).toArray();

            const friendIds = userFriendships.map(friendship => {
                return friendship.user1Id === parent.googleId ? friendship.user2Id
                                                              : friendship.user1Id;
            });

            const friends = await usersCollection.find({googleId: {$in: friendIds}}).toArray();
            return friends.map(user => ({
                ...user,
                id: user.googleId,
                googleId: user.googleId.toString(),
                name: user.username,
            }));
        },

        incomingFriendRequests: async (parent, _, {friendRequestsCollection, usersCollection}) => {
            const requests = await friendRequestsCollection.find({
                                                                     toGoogleId: parent.googleId,
                                                                     status: 'PENDING'
                                                                 }).toArray();

            const requestsWithUsers = await Promise.all(requests.map(async request => {
                const fromUser = await usersCollection.findOne({googleId: request.fromGoogleId});
                return {
                    from: {
                        ...fromUser,
                        id: fromUser.googleId,
                        googleId: fromUser.googleId.toString(),
                        name: fromUser.username,
                    },
                    to: {
                        ...parent,
                        id: parent.googleId,
                        name: parent.username,
                    },
                    status: request.status,
                    createdAt: request.createdAt,
                    updatedAt: request.updatedAt,
                };
            }));

            return requestsWithUsers;
        },

        outgoingFriendRequests: async (parent, _, {friendRequestsCollection, usersCollection}) => {
            const requests = await friendRequestsCollection.find({
                                                                     fromGoogleId: parent.googleId,
                                                                     status: 'PENDING'
                                                                 }).toArray();

            const requestsWithUsers = await Promise.all(requests.map(async request => {
                const toUser = await usersCollection.findOne({googleId: request.toGoogleId});
                return {
                    from: {
                        ...parent,
                        id: parent.googleId,
                        name: parent.username,
                    },
                    to: {
                        ...toUser,
                        id: toUser.googleId,
                        googleId: toUser.googleId.toString(),
                        name: toUser.username,
                    },
                    status: request.status,
                    createdAt: request.createdAt,
                    updatedAt: request.updatedAt,
                };
            }));

            return requestsWithUsers;
        },
    },

    Mutation: {
        sendFriendRequest: async (parent, {email}, {
            usersCollection,
            friendRequestsCollection,
            friendshipsCollection,
            user: currentUser
        }) => {
            const targetUser = await usersCollection.findOne({email});
            if (!targetUser) {
                throw new Error('User not found with this email address');
            }

            if (!currentUser) {
                throw new Error('You must be logged in to send friend requests');
            }

            if (currentUser.email === email) {
                throw new Error('You cannot send a friend request to yourself');
            }

            const existingFriendship = await friendshipsCollection.findOne({
                                                                               $or: [
                                                                                   {
                                                                                       user1Id: currentUser.googleId,
                                                                                       user2Id: targetUser.googleId
                                                                                   },
                                                                                   {
                                                                                       user1Id: targetUser.googleId,
                                                                                       user2Id: currentUser.googleId
                                                                                   }
                                                                               ]
                                                                           });
            if (existingFriendship) {
                throw new Error('You are already friends with this user');
            }

            const existingRequest = await friendRequestsCollection.findOne({
                                                                               $or: [
                                                                                   {
                                                                                       fromGoogleId: currentUser.googleId,
                                                                                       toGoogleId: targetUser.googleId,
                                                                                       status: 'PENDING'
                                                                                   },
                                                                                   {
                                                                                       fromGoogleId: targetUser.googleId,
                                                                                       toGoogleId: currentUser.googleId,
                                                                                       status: 'PENDING'
                                                                                   }
                                                                               ]
                                                                           });
            if (existingRequest) {
                throw new Error('A friend request already exists between you and this user');
            }

            const friendRequest = {
                fromGoogleId: currentUser.googleId,
                toGoogleId: targetUser.googleId,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            await friendRequestsCollection.insertOne(friendRequest);

            return {
                from: {
                    ...currentUser,
                    id: currentUser.googleId,
                    name: currentUser.username,
                },
                to: {
                    ...targetUser,
                    id: targetUser.googleId,
                    googleId: targetUser.googleId.toString(),
                    name: targetUser.username,
                },
                status: friendRequest.status,
                createdAt: friendRequest.createdAt,
                updatedAt: friendRequest.updatedAt,
            };
        },

        acceptFriendRequest: async (parent, {fromGoogleId}, {
            usersCollection,
            friendRequestsCollection,
            friendshipsCollection,
            user: currentUser
        }) => {
            if (!currentUser) {
                throw new Error('You must be logged in to accept friend requests');
            }

            const request = await friendRequestsCollection.findOne({
                                                                       fromGoogleId: fromGoogleId,
                                                                       toGoogleId: currentUser.googleId,
                                                                       status: 'PENDING'
                                                                   });
            if (!request) {
                throw new Error('Friend request not found');
            }

            await friendRequestsCollection.updateOne(
                {_id: request._id},
                {
                    $set: {
                        status: 'ACCEPTED',
                        updatedAt: new Date().toISOString()
                    }
                }
            );

            const friendship = {
                user1Id: request.fromGoogleId,
                user2Id: request.toGoogleId,
                createdAt: new Date().toISOString(),
            };
            await friendshipsCollection.insertOne(friendship);

            const fromUser = await usersCollection.findOne({googleId: request.fromGoogleId});
            return {
                ...fromUser,
                id: fromUser.googleId,
                googleId: fromUser.googleId.toString(),
                name: fromUser.username,
            };
        },

        rejectFriendRequest: async (parent, {fromGoogleId},
                                    {friendRequestsCollection, user: currentUser}) => {
            if (!currentUser) {
                throw new Error('You must be logged in to reject friend requests');
            }

            const request = await friendRequestsCollection.findOne({
                                                                       fromGoogleId: fromGoogleId,
                                                                       toGoogleId: currentUser.googleId,
                                                                       status: 'PENDING'
                                                                   });
            if (!request) {
                throw new Error('Friend request not found');
            }

            await friendRequestsCollection.updateOne(
                {_id: request._id},
                {
                    $set: {
                        status: 'REJECTED',
                        updatedAt: new Date().toISOString()
                    }
                }
            );

            return true;
        },

        cancelFriendRequest: async (parent, {toGoogleId},
                                    {friendRequestsCollection, user: currentUser}) => {
            if (!currentUser) {
                throw new Error('You must be logged in to cancel friend requests');
            }

            const result = await friendRequestsCollection.deleteOne({
                                                                        fromGoogleId: currentUser.googleId,
                                                                        toGoogleId: toGoogleId,
                                                                        status: 'PENDING'
                                                                    });

            if (result.deletedCount === 0) {
                throw new Error('Friend request not found');
            }

            return true;
        },
    },

    Query: {
        friendBalances: async (_, __, {
            usersCollection,
            expensesCollection,
            friendshipsCollection,
            user: currentUser
        }) => {
            if (!currentUser) {
                throw new Error('Authentication required');
            }

            const userId = currentUser.googleId;

            const friendships = await friendshipsCollection.find({
                                                                     $or: [
                                                                         {user1Id: userId},
                                                                         {user2Id: userId}
                                                                     ]
                                                                 }).toArray();

            const friendIds = friendships.map(friendship =>
                                                  friendship.user1Id === userId ? friendship.user2Id
                                                                                : friendship.user1Id
            );

            const friends = await usersCollection.find({googleId: {$in: friendIds}}).toArray();

            const balances = await Promise.all(friends.map(async friend => {
                const friendId = friend.googleId;

                const expenses = await expensesCollection.find({
                                                                   $or: [
                                                                       {
                                                                           paidBy: userId,
                                                                           'participants.userId': friendId
                                                                       },
                                                                       {
                                                                           paidBy: friendId,
                                                                           'participants.userId': userId
                                                                       }
                                                                   ]
                                                               }).toArray();

                let balance = 0;

                expenses.forEach(expense => {
                    const userShare = expense.participants.find(p => p.userId === userId)?.amount
                                      || 0;
                    const friendShare = expense.participants.find(
                        p => p.userId === friendId)?.amount || 0;

                    if (expense.paidBy === userId) {
                        balance += friendShare;
                    } else if (expense.paidBy === friendId) {
                        balance -= userShare;
                    }
                });

                return {
                    friend: {
                        ...friend,
                        id: friend.googleId,
                        name: friend.username
                    },
                    balance: balance,
                    isSettled: balance === 0
                };
            }));

            return balances;
        }
    }
};

export default friendshipResolvers;
