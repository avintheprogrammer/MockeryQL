import { GraphQLObjectType } from 'graphql';
import WildcardFields from '../fields/wildcard';

export default new GraphQLObjectType({
  name: 'buffettAbout',
  fields: WildcardFields,
});
