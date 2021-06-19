import { GraphQLObjectType } from 'graphql';
import PromoFields from '../fields/promo';

export default new GraphQLObjectType({
  name: 'videoHero',
  fields: PromoFields,
});
