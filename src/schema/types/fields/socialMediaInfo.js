import { GraphQLString } from 'graphql';

export default () => ({
  url: {
    type: GraphQLString,
  },
  displayText: {
    type: GraphQLString,
  },
  type: {
    type: GraphQLString,
  },
});
