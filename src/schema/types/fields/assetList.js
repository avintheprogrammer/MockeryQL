import { GraphQLString, GraphQLList } from 'graphql';

import AssetInterfaceType from '../interfaces/asset';
import PaginationType from '../assets/pagination';

import SharedFields from './shared';

export default () => ({
  ...SharedFields(),
  name: {
    type: GraphQLString,
  },
  pagination: {
    type: PaginationType,
  },
  assets: {
    type: new GraphQLList(AssetInterfaceType),
  },
  sectionLabel: {
    type: GraphQLString,
  },
});
