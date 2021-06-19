import {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';

import EncodingType from '../assets/encoding';
import ImageType from '../assets/image';
import TranscriptType from '../assets/transcript';
import SharedFields from './shared';
import AnalyticsFields from './analytics';

import { resolveImage, resolvePlaybackURL, resolvePlayerConfig } from './../../../helpers/video';

export default () => ({
  ...SharedFields(),
  ...AnalyticsFields(),
  usagePlans: {
    type: GraphQLJSON,
  },
  show: {
    type: GraphQLString,
  },
  expireDate: {
    type: GraphQLString,
  },
  encodings: {
    type: new GraphQLList(EncodingType),
  },
  image: {
    type: ImageType,
    resolve: ({ association: associations = [] }) => resolveImage({ associations }),
  },
  playbackURL: {
    type: GraphQLString,
    resolve: ({ encodings = [] }) => resolvePlaybackURL({ encodings }),
  },
  duration: {
    type: GraphQLInt,
  },
  vcpsId: {
    type: GraphQLFloat,
  },
  playerConfig: {
    type: GraphQLJSON,
    args: {
      pageType: {
        type: GraphQLString,
      },
      xfinity: {
        type: GraphQLBoolean,
      },
      device: {
        type: GraphQLString,
      },
    },
    resolve: (playerConfigByType, { pageType, xfinity, device }) => (
      resolvePlayerConfig({ ...playerConfigByType, pageType, xfinity, device })
    ),
  },
  transcript: {
    type: TranscriptType,
  },
  thumbnail: {
    type: GraphQLString,
  },
  uploadDate: {
    type: GraphQLString,
  },
});
