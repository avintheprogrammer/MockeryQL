import { GraphQLObjectType } from 'graphql';
import LivestreamFields from '../fields/livestream';

export default new GraphQLObjectType({
  name: 'livestream',
  fields: LivestreamFields,
});
