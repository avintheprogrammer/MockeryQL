import { GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import AssetInterfaceType from '../interfaces/asset';

export default () => ({
  tagName: {
    type: GraphQLString,
  },
  children: {
    type: GraphQLJSON,
    resolve: ({ children }) => children || [],
  },
  data: {
    type: AssetInterfaceType,
    resolve: ({ data }) => data || {},
  },
  attributes: {
    type: GraphQLJSON,
    resolve: ({ attributes, data }) => attributes || data || {},
  },
});
