import { GraphQLObjectType } from 'graphql';
import MenuFields from '../fields/menu';

export default new GraphQLObjectType({
  name: 'menu',
  fields: MenuFields,
});
