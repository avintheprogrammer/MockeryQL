import { GraphQLString } from 'graphql';

export default () => ({
  title: {
    type: GraphQLString,
  },
  image: {
    type: GraphQLString,
  },
  videoTime: {
    type: GraphQLString,
  },
  videoUrl: {
    type: GraphQLString,
  },
});
