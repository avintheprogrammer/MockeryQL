import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import QuoteType from '../types/assets/quote';
import ApiSources from '../types/assets/apiSource';
import globalAppConfig from '../../app/PhoenixQlConfig';

// defaulting to a higher number for non-prod environments
const { MOST_POPULAR_START_TIME = '550h' } = globalAppConfig.getProperties();

export default {
  type: QuoteType,
  args: {
    source: {
      type: new GraphQLNonNull(ApiSources),
    },
    tag: {
      type: GraphQLString,
      defaultValue: 'Quote Single',
    },
    sortBy: {
      type: GraphQLString,
    },
    startPeriod: {
      type: GraphQLString,
      defaultValue: MOST_POPULAR_START_TIME,
    },
    endPeriod: {
      type: GraphQLString,
    },
    count: {
      type: GraphQLInt,
      defaultValue: 5,
    },
  },
  resolve(_, args, { stores }) {
    return stores.mostPopularQuotes.find(args);
  },
};
