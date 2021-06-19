import { GraphQLObjectType } from 'graphql';
import NavigationFields from '../fields/navigation';

export default new GraphQLObjectType({
  name: 'navigation',
  fields: NavigationFields,
});
