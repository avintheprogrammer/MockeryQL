import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import CollectionFields from '../fields/collection';

export default new GraphQLObjectType({
  name: 'collection',
  interfaces: () => [AssetInterfaceType],
  fields: CollectionFields,
});
