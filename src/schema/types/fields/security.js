import { GraphQLInt, GraphQLString } from 'graphql';
import SharedFields from './shared';

export default () => ({
  ...SharedFields(),
  name: {
    type: GraphQLString,
  },
  issueId: {
    type: GraphQLInt,
  },
  issuerId: {
    type: GraphQLInt,
  },
  tickerSymbol: {
    type: GraphQLString,
  },
  symbol: {
    type: GraphQLString,
  },
  exchangeName: {
    type: GraphQLString,
  },
 countryCode: {
    type: GraphQLString,
  },
  chartSymbol: {
    type: GraphQLString,
  },
});
