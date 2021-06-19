import { GraphQLObjectType } from 'graphql';
import SocialMediaInfoFields from '../fields/socialMediaInfo';

export default new GraphQLObjectType({
  name: 'socialMediaInfo',
  fields: SocialMediaInfoFields,
});
