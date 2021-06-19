import { GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLList } from 'graphql';
import VideoType from '../types/assets/video';

export default {
  type: new GraphQLList(VideoType),
  args: {
    id: {
      type: GraphQLInt,
    },
    transcripts: {
      type: GraphQLBoolean,
    },
    url: {
      type: GraphQLString,
    },
    count: {
      type: GraphQLInt,
    },
  },
  resolve(_, { id, transcripts, url, count }, { stores }) {
    const options = { transcripts };
    return stores.video.getRecommendations({ id, url, count }, options)
      .then((videos) => (
        videos.filter((video) => (video.type === 'cnbcvideo'))
      ));
  },
};
