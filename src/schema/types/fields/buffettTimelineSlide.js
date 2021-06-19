import { GraphQLString, GraphQLList } from 'graphql';
import videoCard from '../assets/videoCard';

export default () => ({
  type: {
    type: GraphQLString,
  },
  title: {
    type: GraphQLString,
  },
  subtitle: {
    type: GraphQLString,
  },
  body: {
    type: new GraphQLList(GraphQLString),
  },
  imageurl: {
    type: GraphQLString,
  },
  quote: {
    type: GraphQLString,
  },
  author: {
    type: GraphQLString,
  },
  quoteLinkUrl: {
    type: GraphQLString,
  },
  quoteLinkText: {
    type: GraphQLString,
  },
  imageCaption: {
    type: GraphQLString,
  },
  card: {
    type: videoCard,
  },
});
