import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import CreatorFields from '../fields/creator';

export default new GraphQLObjectType({
  name: 'creator',
  interfaces: () => [AssetInterfaceType],
  fields: CreatorFields,
});
