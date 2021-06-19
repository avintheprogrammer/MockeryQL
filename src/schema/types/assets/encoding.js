import { GraphQLObjectType } from 'graphql';
import EncodingFields from '../fields/encoding';

export default new GraphQLObjectType({
  name: 'encoding',
  fields: EncodingFields,
});
