import { GraphQLObjectType } from 'graphql';
import BodyFields from '../fields/body';

export default new GraphQLObjectType({
  name: 'body',
  fields: BodyFields,
});
