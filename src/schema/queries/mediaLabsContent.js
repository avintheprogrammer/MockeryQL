import { GraphQLString } from 'graphql';
import MediaLabsContent from '../types/assets/mediaLabsContent';

export default {
  type: MediaLabsContent,
  args: {
    clip: { type: GraphQLString },
  },
  resolve(_, args, { stores }) {
    return stores.mediaLabsContent.find(args);
  },
};
