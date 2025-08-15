import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import typeDefs from './schema/index.js';
import resolvers from './resolvers/index.js';
import {connectToDatabase} from './database/connection.js';

async function startApolloServer() {
    const {
        expensesCollection,
        usersCollection,
        friendshipsCollection,
        friendRequestsCollection
    } = await connectToDatabase();

    const server = new ApolloServer({
                                        typeDefs,
                                        resolvers,
                                    });

    const port = process.env.PORT || 4000;

    const {url} = await startStandaloneServer(server, {
        listen: {port: port, host: '0.0.0.0'},
        context: async ({req}) => {
            const userId = req.headers['userid'] || req.headers['userId'] || req.headers['UserId'];

            let user = null;
            if (userId) {
                user = await usersCollection.findOne({googleId: userId});
                if (user) {
                    user = {
                        ...user,
                        id: user.googleId,
                        googleId: user.googleId.toString(),
                        name: user.username,
                    };
                }
            }

            return {
                expensesCollection,
                usersCollection,
                friendshipsCollection,
                friendRequestsCollection,
                userId,
                user,
            };
        },
    });

    return {url};
}

startApolloServer().then(({url}) => {
    console.log(`Server is running Query at ${url}`);
}).catch(error => {
    console.error('Failed to start server:', error);
});