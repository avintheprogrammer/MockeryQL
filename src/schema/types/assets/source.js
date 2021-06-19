import { GraphQLObjectType } from 'graphql';
import SourceFields from '../fields/source';

export default new GraphQLObjectType({
  name: 'source',
  fields: SourceFields,
});
