import { GraphQLList } from 'graphql';

import MarketType from '../assets/market';

import SharedFields from './shared';

export default () => ({
  ...SharedFields(),
  markets: {
    type: new GraphQLList(MarketType),
  },
});
