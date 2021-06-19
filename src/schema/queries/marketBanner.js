import { GraphQLNonNull, GraphQLInt } from 'graphql';
import MarketBanner from '../types/assets/marketBanner';

export default {
  type: MarketBanner,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    marketCount: {
      type: GraphQLInt,
    },
    securityCount: {
      type: GraphQLInt,
    },
    articleCount: {
      type: GraphQLInt,
    },
  },
  resolve(_, { id, marketCount, securityCount, articleCount }, { stores }) {
    const options = { marketCount, securityCount, articleCount };
    return stores.marketBanner.find({ id }, options);
  },
};
