const userResolvers = {
    Query: {
        users: async (_, __, {usersCollection}) => {
            const users = await usersCollection.find().toArray();
            return users.map(user => ({
                ...user,
                id: user.googleId,
                googleId: user.googleId.toString(),
                name: user.username,
                avatar: user.avatar || null,
            }));
        },
        user: async (_, {id}, {usersCollection}) => {
            const user = await usersCollection.findOne({googleId: id});
            if (!user) {
                throw new Error('User not found');
            }
            return {
                ...user,
                id: user.googleId,
                googleId: user.googleId.toString(),
                name: user.username,
                avatar: user.avatar || null,
            };
        },
        userByGoogleId: async (_, {googleId}, {usersCollection}) => {
            const user = await usersCollection.findOne({googleId: googleId});
            if (!user) {
                throw new Error('User not found');
            }
            return {
                ...user,
                id: user.googleId,
                googleId: user.googleId.toString(),
                name: user.username,
                avatar: user.avatar || null,
            };
        }
    },
    Mutation: {
        createUser: async (_, {input}, {usersCollection}) => {
            const existingUser = await usersCollection.findOne({googleId: input.googleId});

            if (existingUser) {
                const updatedUser = await usersCollection.findOneAndUpdate(
                    {googleId: input.googleId},
                    {
                        $set: {
                            avatar: input.avatar,
                            lastLogin: new Date().toISOString()
                        }
                    },
                    {returnDocument: 'after'}
                );

                return {
                    ...updatedUser,
                    id: updatedUser.googleId,
                    googleId: updatedUser.googleId.toString(),
                    name: updatedUser.username,
                    avatar: updatedUser.avatar || null,
                };
            }
            const newUser = {
                googleId: input.googleId,
                username: input.username,
                email: input.email,
                avatar: input.avatar,
                createdAt: new Date().toISOString(),
            };
            await usersCollection.insertOne(newUser);
            return {
                ...newUser,
                id: newUser.googleId,
                googleId: newUser.googleId.toString(),
                name: newUser.username,
                avatar: newUser.avatar || null,
            };
        },
        deleteUser: async (_, {googleId}, {usersCollection}) => {
            const result = await usersCollection.deleteOne({googleId: googleId});
            if (result.deletedCount === 0) {
                throw new Error('User not found');
            }
            return true;
        }
    }
};

export default userResolvers;