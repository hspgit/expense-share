import {mergeTypeDefs} from '@graphql-tools/merge';
import baseTypeDefs from './baseSchema.js';
import userTypeDefs from './userSchema.js';
import expenseTypeDefs from './expenseSchema.js';
import friendshipTypeDefs from './friendshipSchema.js';
import statsTypeDefs from './statsSchema.js';

const typeDefs = mergeTypeDefs([
                                   baseTypeDefs,
                                   userTypeDefs,
                                   expenseTypeDefs,
                                   friendshipTypeDefs,
                                   statsTypeDefs,
                               ]);

export default typeDefs;
