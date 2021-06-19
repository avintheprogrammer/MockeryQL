import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import types from './types';
import queries from './queries';

export default new GraphQLSchema({
  types: Object.values(types),
  query: new GraphQLObjectType({
    name: 'Query',
    fields: queries,
  }),
});
