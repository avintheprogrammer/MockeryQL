import { GraphQLString } from 'graphql';

export default () => ({
  text: {
    type: GraphQLString,
    resolve: ({ quote }) => quote,
  },
  link: {
    type: GraphQLString,
  },
  label: {
    type: GraphQLString,
  },
  date: {
    type: GraphQLString,
  },
});
