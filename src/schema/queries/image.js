import { GraphQLInt, GraphQLNonNull } from 'graphql';
import Image from '../types/assets/image';

export default {
  type: Image,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
