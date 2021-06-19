import { GraphQLObjectType } from 'graphql';
import SectionHierarchyFields from '../fields/sectionHierarchy';

export default new GraphQLObjectType({
  name: 'sectionHierarchy',
  fields: SectionHierarchyFields,
});
