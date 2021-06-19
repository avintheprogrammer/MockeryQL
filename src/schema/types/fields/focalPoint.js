import { GraphQLInt } from 'graphql';

export default () => ({
  x: {
    type: GraphQLInt,
  },
  y: {
    type: GraphQLInt,
  },
  height: {
    type: GraphQLInt,
  },
  width: {
    type: GraphQLInt,
  },
});
