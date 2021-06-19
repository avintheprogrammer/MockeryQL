import { GraphQLObjectType } from 'graphql';
import videoCardFields from '../fields/videoCard';

export default new GraphQLObjectType({
  name: 'videoCard',
  fields: videoCardFields,
});
