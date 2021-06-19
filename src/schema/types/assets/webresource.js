import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import WebResourceFields from '../fields/webresource';

export default new GraphQLObjectType({
  name: 'webresource',
  interfaces: () => [AssetInterfaceType],
  fields: WebResourceFields,
});
