/* eslint-disable no-param-reassign */
import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';

import ArticleFields from '../fields/article';
import articleTypes from '../../../config/articleTypes.json';

export const ArticleSubtypes = articleTypes.reduce((subtypes, type) => {
  subtypes[type] = new GraphQLObjectType({
    name: type,
    interfaces: () => [AssetInterfaceType],
    fields: ArticleFields,
  });
  return subtypes;
}, {});

export const ArticleType = new GraphQLObjectType({
  name: 'article',
  interfaces: () => [AssetInterfaceType],
  fields: ArticleFields,
});

export default ArticleType;
