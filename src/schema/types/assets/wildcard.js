import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import WildCardFields from '../fields/wildcard';

export default new GraphQLObjectType({
  name: 'wildcard',
  interfaces: () => [AssetInterfaceType],
  fields: WildCardFields,
});
