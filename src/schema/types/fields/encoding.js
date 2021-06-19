import { GraphQLString, GraphQLInt } from 'graphql';

export default () => ({
  url: {
    type: GraphQLString,
  },
  encodingFormat: {
    type: GraphQLString,
  },
  bitrate: {
    type: GraphQLInt,
  },
  formatName: {
    type: GraphQLString,
  },
});
