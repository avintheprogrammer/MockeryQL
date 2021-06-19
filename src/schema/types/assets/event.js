import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import EventFields from '../fields/event';

export default new GraphQLObjectType({
  name: 'event',
  interfaces: () => [AssetInterfaceType],
  fields: EventFields,
});
