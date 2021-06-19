import { GraphQLString } from 'graphql';
import SharedFields from './shared';

export default () => ({
  ...SharedFields(),
  name: {
    type: GraphQLString,
    resolve: ({ title }) => title,
  },
  subType: {
    type: GraphQLString,
  },
});
