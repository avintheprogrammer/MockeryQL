import { GraphQLString, GraphQLList } from 'graphql';

export default () => ({
  summary: {
    type: new GraphQLList(GraphQLString),
  },
  bodyText: {
    type: new GraphQLList(GraphQLString),
  },
  keywords: {
    type: new GraphQLList(GraphQLString),
  },
  keypointsText: {
    type: new GraphQLList(GraphQLString),
  },
  title: {
    type: new GraphQLList(GraphQLString),
  },
  tagName: {
    type: new GraphQLList(GraphQLString),
  },
  slug: {
    type: new GraphQLList(GraphQLString),
  },
});
