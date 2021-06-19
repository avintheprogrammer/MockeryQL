import { GraphQLString, GraphQLInt } from 'graphql';

export default () => ({
  socialtoolsEnabled: {
    type: GraphQLString,
  },
  displayByline: {
    type: GraphQLString,
  },
  outbrainEnabled: {
    type: GraphQLString,
  },
  listType: {
    type: GraphQLString,
  },
  tweetOnPublish: {
    type: GraphQLInt,
  },
});
