import { GraphQLObjectType } from 'graphql';
import MediaLabsContentFields from '../fields/mediaLabsContent';

export default new GraphQLObjectType({
  name: 'mediaLabsContent',
  fields: MediaLabsContentFields,
});
