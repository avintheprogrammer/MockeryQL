import { GraphQLInt, GraphQLList } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import ChapterType from '../assets/chapter';

export default () => ({
  duration: {
    type: GraphQLInt,
  },
  chapters: {
    type: new GraphQLList(ChapterType),
  },
  cues: {
    type: new GraphQLList(GraphQLJSON),
  },
});
