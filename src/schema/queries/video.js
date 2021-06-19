import { GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import VideoType from '../types/assets/video';

export default {
  type: VideoType,
  args: {
    id: {
      type: GraphQLInt,
    },
    transcripts: {
      type: GraphQLBoolean,
    },
    videoRecommendation: {
      type: GraphQLBoolean,
    },
    url: {
      type: GraphQLString,
    },
  },
  resolve(_, { id, transcripts, videoRecommendation, url }, { stores }) {
    const options = { transcripts };
    return stores.video.find({ id, videoRecommendation, url }, options);
  },
};
