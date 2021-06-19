import { GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import BodyType from '../assets/body';
import HighlightType from '../assets/highlight';
import { ArticleType } from '../assets/article';
import SocialMediaInfoType from '../assets/socialMediaInfo';

import SharedFields from './shared';

import { resolveContent, isPremium } from './../../../helpers/asset';
import { resolveBody, resolveRelatedArticle } from './../../../helpers/article';

export default () => ({
  ...SharedFields(),
  title: {
    type: GraphQLString,
    resolve: ({ title, headline }) => title || headline,
  },
  highlights: {
    type: HighlightType,
  },
  bodyTeaser: {
    type: GraphQLJSON,
    resolve: ({ version, bodyTeaser: xml, association: associations }) => (
      resolveContent({ version, xml, associations })
    ),
  },
  body: {
    type: BodyType,
    args: {
      uid: {
        type: GraphQLString,
      },
      sessionToken: {
        type: GraphQLString,
      },
      isNewProUser: {
        type: GraphQLBoolean,
      },
    },
    resolve: async ({
      settings = {},
      xmlArticleBody: xml = '',
      association: associations = [],
    }, args, { stores }) => {
      const { freeContent, premiumContent } = resolveBody({ xml, associations });

      if (!isPremium({ settings })) return { isAuthenticated: false, content: freeContent };

      const isAuthenticated = await stores.article.resolveProAuthentication(args);
      const content = isAuthenticated && premiumContent
        ? [...freeContent, ...premiumContent]
        : freeContent;

      return { isAuthenticated, content };
    },
  },
  keyPoints: {
    type: GraphQLJSON,
    resolve: ({ xmlKeyPoints: xml = '', association: associations = [] }) => (
      resolveContent({ xml, associations })
    ),
  },
  relatedContent: {
    type: ArticleType,
    resolve: ({ id, association: associations = [] }) => (
      resolveRelatedArticle({ id, associations })
    ),
  },
  socialMediaInfo: {
    type: new GraphQLList(SocialMediaInfoType),
  },
});
