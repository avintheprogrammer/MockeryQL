import { GraphQLObjectType } from 'graphql';
import FocalPointFields from '../fields/focalPoint';

export default new GraphQLObjectType({
  name: 'focalPoint',
  fields: FocalPointFields,
});
