import { GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import FocalPointType from '../assets/focalPoint';

import SharedFields from './shared';

export default () => ({
  ...SharedFields(),
  type: {
    type: GraphQLString,
    resolve: ({ type = 'image' }) => type,
  },
  isPromoted: {
    type: GraphQLBoolean,
    resolve: ({ isPromoted }) => isPromoted === 'true',
  },
  isHighTouch: {
    type: GraphQLBoolean,
    resolve: ({ isHighTouch }) => isHighTouch === 'true',
  },
  contentSize: {
    type: GraphQLInt,
  },
  caption: {
    type: GraphQLString,
  },
  filter: {
    type: GraphQLString,
  },
  height: {
    type: GraphQLInt,
  },
  width: {
    type: GraphQLInt,
  },
  focalPoints: {
    type: FocalPointType,
  },
  copyrightHolder: {
    type: GraphQLString,
  },
});
