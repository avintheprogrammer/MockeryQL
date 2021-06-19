import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import TagFields from '../fields/tag';

export default new GraphQLObjectType({
  name: 'tag',
  interfaces: () => [AssetInterfaceType],
  fields: TagFields,
});
