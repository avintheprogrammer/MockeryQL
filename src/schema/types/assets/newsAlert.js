import { GraphQLObjectType } from 'graphql';
import NewsAlertFields from '../fields/newsAlert';

export default new GraphQLObjectType({
  name: 'newsAlert',
  fields: NewsAlertFields,
});
