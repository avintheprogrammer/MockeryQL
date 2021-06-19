import { GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import BodyType from '../assets/body';
import ImageType from '../assets/image';

import SharedFields from './shared';

import { resolveBody } from './../../../helpers/article';
import { resolveContent } from './../../../helpers/asset';

export default () => ({
  ...SharedFields(),
  title: {
    type: GraphQLString,
    resolve: ({ title, headline }) => title || headline,
  },
  contentText: {
    type: GraphQLString,
    resolve: ({ wildcard = {} }) => {
      const { wildcardContent = {} } = wildcard;
      return wildcardContent.cdata;
    },
  },
  promoText: {
    type: GraphQLString,
    resolve: ({ wildcard = {} }) => {
      const { wildcardPromo = {} } = wildcard;
      return wildcardPromo.cdata;
    },
  },
  body: {
    type: BodyType,
    resolve: ({ xmlArticleBody: xml = '', association: associations = [] }) => {
      const { freeContent: content } = resolveBody({ xml, associations });
      return { content };
    },
  },
  keyPoints: {
    type: GraphQLJSON,
    resolve: ({ xmlKeyPoints: xml = '', association: associations = [] }) => (
      resolveContent({ xml, associations })
    ),
  },
  image: {
    type: ImageType,
  },
});
