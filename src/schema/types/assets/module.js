import { GraphQLObjectType } from 'graphql';
import ModuleFields from '../fields/module';

export default new GraphQLObjectType({
  name: 'module',
  fields: ModuleFields,
});
