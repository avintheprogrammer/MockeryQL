import { GraphQLObjectType } from 'graphql';

import AssetInterfaceType from '../interfaces/asset';
import FeaturedMediaInterfaceType from './featuredMedia';

import ImageFields from '../fields/image';

export default new GraphQLObjectType({
  name: 'image',
  interfaces: () => [AssetInterfaceType, FeaturedMediaInterfaceType],
  fields: ImageFields,
});
