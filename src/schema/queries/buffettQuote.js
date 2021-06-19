/* eslint-disable import/prefer-default-export */

import { GraphQLString } from 'graphql';
import BuffettQuoteType from '../types/modules/buffettQuote';

export default {
  type: BuffettQuoteType,
  args: {
    date: { type: GraphQLString },
  },
  resolve(_, { date }, { stores }) {
    return stores.buffettQuote.findRandom({ date });
  },
};
