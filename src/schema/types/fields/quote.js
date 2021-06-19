import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const QuoteFields = new GraphQLObjectType({
  name: 'QuoteFields',
  fields: {
    issueId: {
      type: GraphQLInt,
      resolve: ({ issue_id: issueId }) => issueId,
    },
    issuerId: {
      type: GraphQLInt,
      resolve: ({ issuer_id: issuerId }) => issuerId,
    },
    type: {
      type: GraphQLString,
      resolve: () => 'security',
    },
    subType: {
      type: GraphQLString,
      resolve: ({ type }) => type,
    },
    name: {
      type: GraphQLString,
    },
    exchangeName: {
      type: GraphQLString,
      resolve: ({ exchange }) => exchange,
    },
    symbol: {
      type: GraphQLString,
    },
    countryCode: {
      type: GraphQLString,
    },
    altSymbol: {
      type: GraphQLString,
    },
    tickerSymbol: {
      type: GraphQLString,
      resolve: ({ exchange, symbol }) => `${exchange} ${symbol}`,
    },
    url: {
      type: GraphQLString,
    },
  },
});

export default () => ({
  assets: {
    type: new GraphQLList(QuoteFields),
  },
});
