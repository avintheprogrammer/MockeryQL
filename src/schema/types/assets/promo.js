import { GraphQLObjectType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import PromoFields from '../fields/promo';

export default new GraphQLObjectType({
  name: 'promo',
  interfaces: () => [AssetInterfaceType],
  fields: PromoFields,
});
