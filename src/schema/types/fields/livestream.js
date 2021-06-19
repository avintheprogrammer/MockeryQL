import {
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import { resolveWeekendMode } from '../../../helpers/livestream';

export default () => ({
  timeZone: {
    type: GraphQLString,
  },
  endTime: {
    type: GraphQLString,
  },
  inCache: {
    type: GraphQLBoolean,
  },
  altURL: {
    type: GraphQLString,
  },
  restricted: {
    type: GraphQLBoolean,
  },
  startTime: {
    type: GraphQLString,
  },
  ignoreWeekend: {
    type: GraphQLBoolean,
  },
  protectedURL: {
    type: GraphQLString,
  },
  remaining: {
    type: GraphQLString,
  },
  url: {
    type: GraphQLString,
  },
  name: {
    type: GraphQLString,
  },
  tokenGenerator: {
    type: GraphQLString,
  },
  isWeekendMode: {
    type: GraphQLBoolean,
    resolve: () => resolveWeekendMode(),
  },
});
