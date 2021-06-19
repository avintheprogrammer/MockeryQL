import { GraphQLObjectType } from 'graphql';
import ProjectFields from '../fields/project';

export default new GraphQLObjectType({
  name: 'project',
  fields: ProjectFields,
});
