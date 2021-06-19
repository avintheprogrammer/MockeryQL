import { GraphQLObjectType } from 'graphql';
import TranscriptFields from '../fields/transcript';

export default new GraphQLObjectType({
  name: 'transcript',
  fields: TranscriptFields,
});
