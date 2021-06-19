import { GraphQLInt, GraphQLString } from 'graphql';
import urlDetails from '../../../lib/urlDetails';

export default () => ({
  id: {
    type: GraphQLInt,
  },
  type: {
    type: GraphQLString,
  },
  name: {
    type: GraphQLString,
  },
  host: {
    type: GraphQLString,
    resolve: (navigation) => {
      const { host } = urlDetails(navigation);
      return host;
    },
  },
  path: {
    type: GraphQLString,
    resolve: (navigation) => {
      const { path } = urlDetails(navigation);
      return path;
    },
  },
});
