import { GraphQLObjectType } from 'graphql';
import BuffettTimelineFields from '../fields/buffettTimeline';

export default new GraphQLObjectType({
  name: 'buffettTimeline',
  fields: BuffettTimelineFields,
});
