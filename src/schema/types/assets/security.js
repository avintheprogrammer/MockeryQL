import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import SecurityFields from '../fields/security';

export default new GraphQLObjectType({
  name: 'security',
  interfaces: () => [AssetInterfaceType],
  fields: SecurityFields,
});
