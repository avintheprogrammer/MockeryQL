import { GraphQLObjectType } from 'graphql';
import PublisherFields from '../fields/publisher';

export default new GraphQLObjectType({
  name: 'publisher',
  fields: PublisherFields,
});
