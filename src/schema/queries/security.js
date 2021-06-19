import { GraphQLInt } from 'graphql';
import Security from '../types/assets/security';

export default {
  type: Security,
  args: {
    id: {
      type: GraphQLInt,
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
