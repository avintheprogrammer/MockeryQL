import { GraphQLInt, GraphQLString } from 'graphql';
import Person from '../types/assets/person';

export default {
  type: Person,
  args: {
    id: {
      type: GraphQLInt,
    },
    url: {
      type: GraphQLString,
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
