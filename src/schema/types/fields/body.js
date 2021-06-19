import { GraphQLBoolean, GraphQLList } from 'graphql';

import BodyContentType from '../assets/bodyContent';

export default () => ({
  isAuthenticated: {
    type: GraphQLBoolean,
    resolve: ({ isAuthenticated = false }) => isAuthenticated,
  },
  content: {
    type: new GraphQLList(BodyContentType),
  },
});
