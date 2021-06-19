import { GraphQLObjectType } from 'graphql';
import PaginationFields from '../fields/pagination';

export default new GraphQLObjectType({
  name: 'pagination',
  fields: PaginationFields,
});
