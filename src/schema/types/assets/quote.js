import { GraphQLObjectType } from 'graphql';
import QuoteFields from '../fields/quote';

export default new GraphQLObjectType({
  name: 'Quotes',
  fields: QuoteFields,
});
