import { GraphQLInt, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import ImageType from '../assets/image';

import SharedFields from './shared';

import { resolveContent } from './../../../helpers/asset';

export default () => ({
  ...SharedFields(),
  articlebody: {
    type: GraphQLString,
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
  image: {
    type: ImageType,
  },
  startDate: {
    type: GraphQLString,
    resolve: ({ eventStartDate }) => eventStartDate,
  },
  endDate: {
    type: GraphQLString,
    resolve: ({ eventEndDate }) => eventEndDate,
  },
  timezone: {
    type: GraphQLString,
    resolve: ({ eventTimezone }) => eventTimezone,
  },
  registrationDeadlineDate: {
    type: GraphQLString,
    resolve: ({ eventRegistrationDeadlineDate }) => eventRegistrationDeadlineDate,
  },
  status: {
    type: GraphQLString,
    resolve: ({ eventStatus }) => eventStatus,
  },
  capacity: {
    type: GraphQLInt,
    resolve: ({ eventCapacity }) => eventCapacity,
  },
  phone: {
    type: GraphQLString,
    resolve: ({ eventPhone }) => eventPhone,
  },
  email: {
    type: GraphQLString,
    resolve: ({ eventEmail }) => eventEmail,
  },
  landingPage: {
    type: GraphQLString,
    resolve: ({ eventLandingPage }) => eventLandingPage,
  },
  location: {
    type: GraphQLString,
    resolve: ({ eventLocation }) => eventLocation,
  },
});
