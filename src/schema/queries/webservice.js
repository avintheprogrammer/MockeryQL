import { GraphQLNonNull, GraphQLInt } from 'graphql';
import Webservice from '../types/assets/webservice';

export default {
  type: Webservice,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
