import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import WebServiceFields from '../fields/webservice';

export default new GraphQLObjectType({
  name: 'webservice',
  interfaces: () => [AssetInterfaceType],
  fields: WebServiceFields,
});
