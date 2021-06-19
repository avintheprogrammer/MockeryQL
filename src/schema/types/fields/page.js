import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import LayoutType from '../assets/layout';

import SharedFields from './shared';
import AnalyticsFields from './analytics';

import { resolveLayout } from './../../../helpers/page';

export default () => ({
  ...SharedFields(),
  ...AnalyticsFields(),
  template: {
    type: GraphQLString,
  },
  templateVariant: {
    type: GraphQLInt,
  },
  layout: {
    type: new GraphQLList(LayoutType),
    resolve: ({
      id, section = {}, association: associations = [], layout = [], settings = {} }) =>
        resolveLayout({ id, section, associations, layout, settings }),
  },
});
