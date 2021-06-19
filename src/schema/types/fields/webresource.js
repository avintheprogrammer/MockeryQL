import { GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import SharedFields from './shared';

export default () => ({
  ...SharedFields(),
  href: {
    type: GraphQLString,
    resolve: ({ webResource }) => {
      const { webResourceAttributeUrl } = webResource || {};
      return webResourceAttributeUrl;
    },
  },
  linkText: {
    type: GraphQLString,
    resolve: ({ webResource }) => {
      const { webResourceLinkText } = webResource || {};
      return webResourceLinkText;
    },
  },
  linkTitle: {
    type: GraphQLString,
    resolve: ({ webResource }) => {
      const { webResourceAttributeTitle } = webResource || {};
      return webResourceAttributeTitle;
    },
  },
  linkTarget: {
    type: GraphQLString,
    resolve: ({ webResource }) => {
      const { webResourceAttributeTarget } = webResource || {};
      return webResourceAttributeTarget;
    },
  },
  linkRel: {
    type: GraphQLString,
    resolve: ({ webResource }) => {
      const { webResourceAttributeRel } = webResource || {};
      return webResourceAttributeRel;
    },
  },
  isFeed: {
    type: GraphQLBoolean,
    resolve: ({ webResource }) => {
      const { webResourceIsFeed } = webResource || {};
      return webResourceIsFeed;
    },
  },
  refreshInterval: {
    type: GraphQLInt,
    resolve: ({ webResource }) => {
      const { webResourceRefreshInterval } = webResource || {};
      return webResourceRefreshInterval;
    },
  },
  lastRefreshTime: {
    type: GraphQLInt,
    resolve: ({ webResource }) => {
      const { webResourceLastRefreshTime } = webResource || {};
      return webResourceLastRefreshTime;
    },
  },
});
