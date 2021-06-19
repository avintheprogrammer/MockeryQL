import { GraphQLObjectType } from 'graphql';
import HighlightFields from '../fields/highlight';

export default new GraphQLObjectType({
  name: 'highlight',
  fields: HighlightFields,
});
