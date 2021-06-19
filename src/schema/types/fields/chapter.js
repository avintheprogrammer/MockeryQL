import { GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default () => ({
  in: {
    type: GraphQLInt,
  },
  out: {
    type: GraphQLInt,
  },
  chapter: {
    type: GraphQLInt,
  },
  keyChapter: {
    type: GraphQLInt,
  },
  transcript: {
    type: new GraphQLList(GraphQLJSON),
  },
  title: {
    type: GraphQLString,
  },
});
