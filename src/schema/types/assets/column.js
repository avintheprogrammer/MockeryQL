import { GraphQLObjectType } from 'graphql';
import ColumnFields from '../fields/column';

export default new GraphQLObjectType({
  name: 'column',
  fields: ColumnFields,
});
