import GraphQLJSON from 'graphql-type-json';
import { chapter } from '../../../mocks/buffettTranscriptMock.json';

export default () => ({
  chapter: {
    type: GraphQLJSON,
    resolve: () => chapter,
  },
  cues: {
    type: GraphQLJSON,
  },
});
