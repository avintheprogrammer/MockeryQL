import { GraphQLObjectType } from 'graphql';
import LayoutFields from '../fields/layout';

export default new GraphQLObjectType({
  name: 'layout',
  fields: LayoutFields,
});
