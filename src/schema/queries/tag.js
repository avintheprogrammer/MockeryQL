import { GraphQLInt, GraphQLString } from 'graphql';
import Tag from '../types/assets/tag';

export default {
  type: Tag,
  args: {
    id: {
      type: GraphQLInt,
    },
    url: {
      type: GraphQLString,
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
