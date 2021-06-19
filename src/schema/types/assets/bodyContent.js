import { GraphQLObjectType } from 'graphql';
import BodyContentFields from '../fields/bodyContent';

export default new GraphQLObjectType({
  name: 'bodyContent',
  fields: BodyContentFields,
});
