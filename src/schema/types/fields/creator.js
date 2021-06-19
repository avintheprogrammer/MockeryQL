import { GraphQLList, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import SocialMediaInfoType from '../assets/socialMediaInfo';

import SharedFields from './shared';

import { resolveContent } from '../../../helpers/asset';

export default () => ({
  ...SharedFields(),
  name: {
    type: GraphQLString,
  },
  image: {
    type: GraphQLString,
  },
  socialMediaInfo: {
    type: new GraphQLList(SocialMediaInfoType),
  },
  body: {
    type: GraphQLJSON,
    resolve: ({ xmlArticleBody: xml = '', association: associations = [] }) => (
      resolveContent({ xml, associations })
    ),
  },
  keyPoints: {
    type: GraphQLJSON,
    resolve: ({ xmlKeyPoints: xml = '', association: associations = [] }) => (
      resolveContent({ xml, associations })
    ),
  },
});
