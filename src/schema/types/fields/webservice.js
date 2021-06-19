import { GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import SharedFields from './shared';

import { resolveParameters } from '../../../helpers/webservice';

export default () => ({
  ...SharedFields(),
  widgetDisplayName: {
    type: GraphQLString,
  },
  widget: {
    type: GraphQLJSON,
    resolve: ({ widgetName: widgetType, parameters }) => ({
      widgetType,
      widgetParams: resolveParameters(parameters),
    }),
  },
});
