import { GraphQLClient } from 'graphql-request';

const url = '/graphql';

export const graphQLClient = new GraphQLClient(url);
