/* eslint-disable no-param-reassign */

import { GraphQLInt, GraphQLString } from 'graphql';
import { ArticleType, ArticleSubtypes } from '../types/assets/article';

const baseQuery = {
  args: {
    id: {
      type: GraphQLInt,
    },
    url: {
      type: GraphQLString,
    },
  },
  resolve: (_, args, { stores }) => stores.article.find(args),
};

export const articleSubtypeQueries = Object.keys(ArticleSubtypes).reduce((subtypes, type) => {
  subtypes[type] = {
    type: ArticleType,
    ...baseQuery,
  };
  return subtypes;
}, {});

export const articleQuery = {
  type: ArticleType,
  ...baseQuery,
};

export default articleQuery;
