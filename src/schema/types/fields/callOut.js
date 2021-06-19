import { GraphQLString } from 'graphql';

export default () => ({
  url: {
    type: GraphQLString,
  },
  text: {
    type: GraphQLString,
  },
});
