import { GraphQLObjectType } from 'graphql';
import MediaLabsSearch from '../fields/mediaLabsSearch';

export default new GraphQLObjectType({
  name: 'mediaLabsSearch',
  fields: MediaLabsSearch,
});
