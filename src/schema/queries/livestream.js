import { GraphQLString, GraphQLNonNull } from 'graphql';
import Livestream from '../types/assets/livestream';

export default {
  type: Livestream,
  args: {
    uid: {
      type: new GraphQLNonNull(GraphQLString),
    },
    sessionToken: {
      type: new GraphQLNonNull(GraphQLString),
    },
    streamName: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(_, args, { stores }) {
    return stores.vapi.getPlaybackURL(args);
  },
};
