import { GraphQLList, GraphQLBoolean, GraphQLInt } from 'graphql';
import VideoType from '../types/assets/video';

export default {
  type: new GraphQLList(VideoType),
  args: {
    ids: {
      type: new GraphQLList(GraphQLInt),
    },
    transcripts: {
      type: GraphQLBoolean,
    },
  },
  resolve(_, { ids, transcripts }, { stores }) {
    const options = { transcripts };
    return Promise.all(ids.map((id) => (
      stores.video.find({ id }, options)
    ))).then((videos) => (
      videos.filter((video) => (
        video && // filter out nulls
        video.type === 'cnbcvideo' // filter out non-videos
      ))
    ));
  },
};
