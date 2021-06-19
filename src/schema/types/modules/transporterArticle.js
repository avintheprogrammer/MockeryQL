import { GraphQLObjectType } from 'graphql';
import ArticleFields from '../fields/article';

export default new GraphQLObjectType({
  name: 'transporterArticle',
  fields: ArticleFields,
});
