import { GraphQLObjectType } from 'graphql';
import FranchiseFields from '../fields/franchise';

export default new GraphQLObjectType({
  name: 'videoIntro',
  fields: FranchiseFields,
});
