import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import PersonFields from '../fields/person';

export default new GraphQLObjectType({
  name: 'person',
  interfaces: () => [AssetInterfaceType],
  fields: PersonFields,
});
