import { GraphQLString } from 'graphql';
import MediaLabsSearch from '../types/assets/mediaLabsSearch';

export default {
  type: MediaLabsSearch,
  args: {
    term: { type: GraphQLString },
  },
  resolve(_, args, { stores }) {
    return stores.mediaLabsSearch.find(args);
  },
};
