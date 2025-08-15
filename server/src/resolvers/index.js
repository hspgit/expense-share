import {mergeResolvers} from '@graphql-tools/merge';
import userResolvers from './userResolvers.js';
import expenseResolvers from './expenseResolvers.js';
import friendshipResolvers from './friendshipResolvers.js';
import statsResolvers from './statsResolvers.js';

const resolvers = mergeResolvers([
                                     userResolvers,
                                     expenseResolvers,
                                     friendshipResolvers,
                                     statsResolvers,
                                 ]);

export default resolvers;
