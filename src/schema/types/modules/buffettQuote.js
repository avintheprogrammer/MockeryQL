import { GraphQLObjectType } from 'graphql';
import BuffettQuoteFields from '../fields/buffettQuote';

export default new GraphQLObjectType({
  name: 'buffettQuote',
  fields: BuffettQuoteFields,
});
