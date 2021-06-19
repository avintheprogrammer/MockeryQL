import { GraphQLObjectType } from 'graphql';
import buffettTimelineSlideFields from '../fields/buffettTimelineSlide';

export default new GraphQLObjectType({
  name: 'slide',
  fields: buffettTimelineSlideFields,
});
