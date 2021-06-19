import { GraphQLInt } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default () => ({
  link: {
    type: GraphQLJSON,
  },
  page: {
    type: GraphQLInt,
  },
  totalCount: {
    type: GraphQLInt,
  },
  pageSize: {
    type: GraphQLInt,
  },
});
