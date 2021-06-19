import { GraphQLNonNull, GraphQLInt } from 'graphql';
import Webresource from '../types/assets/webresource';

export default {
  type: Webresource,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
