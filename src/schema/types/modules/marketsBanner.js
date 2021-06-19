import { GraphQLObjectType } from 'graphql';
import MarketBannerFields from '../fields/marketBanner';

export default new GraphQLObjectType({
  name: 'marketsBanner',
  fields: MarketBannerFields,
});
