import {MongoClient} from 'mongodb';

const MONGO_DB_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'expense-share-db';

let db, expensesCollection, usersCollection, friendshipsCollection, friendRequestsCollection;

const connectToDatabase = async () => {
    try {
        const client = new MongoClient(MONGO_DB_URL);
        await client.connect();
        db = client.db(MONGO_DB_NAME);
        expensesCollection = db.collection('expenses');
        usersCollection = db.collection('users');
        friendshipsCollection = db.collection('friendships');
        friendRequestsCollection = db.collection('friendRequests');
        console.log('Connected to MongoDB');
        return {
            db,
            expensesCollection,
            usersCollection,
            friendshipsCollection,
            friendRequestsCollection
        };
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export {connectToDatabase};
