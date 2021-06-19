import { GraphQLObjectType } from 'graphql';
import CallOutFields from '../fields/callOut';

export default new GraphQLObjectType({
  name: 'callOut',
  fields: CallOutFields,
});
