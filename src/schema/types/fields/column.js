import { GraphQLList, GraphQLString, GraphQLBoolean } from 'graphql';
import ModuleType from '../assets/module';

export default () => ({
  modules: {
    type: new GraphQLList(ModuleType),
  },
  span: {
    type: GraphQLString,
  },
  editable: {
    type: GraphQLBoolean,
  },
});
