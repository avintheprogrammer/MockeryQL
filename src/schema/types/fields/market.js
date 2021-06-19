import { GraphQLString, GraphQLList } from 'graphql';

import { ArticleType } from '../assets/article';
import SecurityType from '../assets/security';

import SharedFields from './shared';

import { resolveSecurities, resolveArticle } from '../../../helpers/market';

function isPromoRelation(relation) {
  const { relationType } = relation || {};
  return relationType === 'promo';
}

function sortRelatedPosition(a, b) {
  const { position: aRelatedPromoPosition } = a.relation.find(isPromoRelation);
  const { position: bRelatedPromoPosition } = b.relation.find(isPromoRelation);
  return bRelatedPromoPosition - aRelatedPromoPosition;
}

export default () => ({
  ...SharedFields(),
  name: {
    type: GraphQLString,
    resolve: ({ name, headline }) =>
      // temporary fallback & shortened display name for client
      `${name || headline}`.replace(/\s(marke(ts|s|)|data)/i, '')
    ,
  },
  securities: {
    type: new GraphQLList(SecurityType),
    resolve: (market) => {
      const { association: associations = [], securityCount } = market;
      const securities = resolveSecurities({ associations }).sort(sortRelatedPosition);
      return (securityCount) ? securities.slice(0, securityCount) : securities;
    },
  },
  articles: {
    type: new GraphQLList(ArticleType),
    resolve: (market) => {
      const { association: associations = [], articleCount } = market;
      const articles = resolveArticle({ associations });
      return (articleCount) ? articles.slice(0, articleCount) : articles;
    },
  },
  tabLabel: {
    type: GraphQLString,
  },
});
