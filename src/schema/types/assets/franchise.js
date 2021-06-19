import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import FranchiseFields from '../fields/franchise';

export default new GraphQLObjectType({
  name: 'franchise',
  interfaces: () => [AssetInterfaceType],
  fields: FranchiseFields,
});
