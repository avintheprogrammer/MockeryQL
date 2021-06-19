import { GraphQLObjectType } from 'graphql';
import WildcardFields from '../fields/wildcard';

export default new GraphQLObjectType({
  name: 'makeItAbout',
  fields: WildcardFields,
});
