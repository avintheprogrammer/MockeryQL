import { GraphQLObjectType } from 'graphql';

import AssetInterfaceType from '../interfaces/asset';
import FeaturedMediaInterfaceType from './featuredMedia';

import VideoFields from '../fields/video';

export default new GraphQLObjectType({
  name: 'cnbcvideo',
  interfaces: () => [AssetInterfaceType, FeaturedMediaInterfaceType],
  fields: VideoFields,
});
