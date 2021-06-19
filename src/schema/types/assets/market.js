import { GraphQLObjectType } from 'graphql';
import MarketFields from '../fields/market';

export default new GraphQLObjectType({
  name: 'market',
  fields: MarketFields,
});
