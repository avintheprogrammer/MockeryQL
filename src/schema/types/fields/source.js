import { GraphQLInt, GraphQLString } from 'graphql';
import { resolveTagNameFormatted } from './../../../helpers/page';

export default () => ({
  id: {
    type: GraphQLInt,
  },
  type: {
    type: GraphQLString,
  },
  slug: {
    type: GraphQLString,
  },
  contentUrl: {
    type: GraphQLString,
  },
  url: {
    type: GraphQLString,
  },
  name: {
    type: GraphQLString,
  },
  description: {
    type: GraphQLString,
  },
  tagName: {
    type: GraphQLString,
  },
  tagNameFormatted: {
    type: GraphQLString,
    resolve: ({ tagName }) => resolveTagNameFormatted(tagName, true),
  },
  tagNameFormattedFull: {
    type: GraphQLString,
    resolve: ({ tagName }) => resolveTagNameFormatted(tagName),
  },
  logo: {
    type: GraphQLString,
    resolve: ({ sourceLogo }) => sourceLogo,
  },
  name: { // eslint-disable-line
    type: GraphQLString,
    resolve: ({ sourceName }) => sourceName,
  },
  creatorOverwrite: {
    type: GraphQLString,
  },
  shortestHeadline: {
    type: GraphQLString,
  },
  linkHeadline: {
    type: GraphQLString,
  },
});
