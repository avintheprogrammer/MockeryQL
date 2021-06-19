import { GraphQLList, GraphQLBoolean } from 'graphql';
import ColumnType from '../assets/column';

export default () => ({
  columns: {
    type: new GraphQLList(ColumnType),
  },
  editable: {
    type: GraphQLBoolean,
  },
});
