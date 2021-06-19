import { GraphQLString } from 'graphql';
import CallOutType from '../assets/callOut';
import SharedFields from './shared';

export default () => ({
  ...SharedFields(),
  eyebrow: {
    type: GraphQLString,
    resolve: ({ shortestHeadline }) => shortestHeadline,
  },
  headline: {
    type: GraphQLString,
    resolve: ({
      shorterHeadline,
      linkHeadline,
      title,
    }) => shorterHeadline || linkHeadline || title,
  },
  description: {
    type: GraphQLString,
    resolve: ({
      shortestDescription,
      shorterDescription,
      description,
    }) => shortestDescription || shorterDescription || description,
  },
  callout: {
    type: CallOutType,
    resolve: ({ webResource }) => {
      const { webResourceAttributeUrl: url, webResourceLinkText: text } = webResource || {};
      return { url, text };
    },
  },
});
