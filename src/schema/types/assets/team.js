import { GraphQLObjectType } from 'graphql';
import TeamFields from '../fields/team';

export default new GraphQLObjectType({
  name: 'team',
  fields: TeamFields,
});
