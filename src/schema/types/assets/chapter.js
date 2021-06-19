import { GraphQLObjectType } from 'graphql';
import ChapterFields from '../fields/chapter';

export default new GraphQLObjectType({
  name: 'chapter',
  fields: ChapterFields,
});
