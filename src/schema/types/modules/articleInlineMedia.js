import { GraphQLObjectType } from 'graphql';
import ArticleFields from '../fields/article';

export default new GraphQLObjectType({
  name: 'articleInlineMedia',
  fields: ArticleFields,
});
