import { GraphQLObjectType } from 'graphql';
import VideoFields from '../fields/video';

export default new GraphQLObjectType({
  name: 'clipPlayer',
  fields: VideoFields,
});
