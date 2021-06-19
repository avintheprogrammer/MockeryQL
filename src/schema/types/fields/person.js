import { GraphQLList, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import BodyType from '../assets/body';
import ImageType from '../assets/image';
import SocialMediaInfoType from '../assets/socialMediaInfo';

import SharedFields from './shared';

import { resolveBody } from '../../../helpers/article';
import { resolveContent } from '../../../helpers/asset';

export default () => ({
  ...SharedFields(),
  name: {
    type: GraphQLString,
  },
  image: {
    type: ImageType,
  },
  socialMediaInfo: {
    type: new GraphQLList(SocialMediaInfoType),
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
});
