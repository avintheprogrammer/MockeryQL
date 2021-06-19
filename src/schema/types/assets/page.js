import { GraphQLObjectType } from 'graphql';
import PageFields from '../fields/page';

export default new GraphQLObjectType({
  name: 'page',
  fields: PageFields,
});
