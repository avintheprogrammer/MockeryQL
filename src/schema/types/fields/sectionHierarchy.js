import { GraphQLInt, GraphQLString } from 'graphql';
import { resolveTagNameFormatted } from './../../../helpers/page';

export default () => ({
  id: {
    type: GraphQLInt,
  },
  tagName: {
    type: GraphQLString,
  },
  order: {
    type: GraphQLInt,
  },
  tagNameFormatted: {
    type: GraphQLString,
    resolve: ({ tagName }) => resolveTagNameFormatted(tagName, true),
  },
  tagNameFormattedFull: {
    type: GraphQLString,
    resolve: ({ tagName }) => resolveTagNameFormatted(tagName),
  },
});
