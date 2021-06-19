import { GraphQLObjectType } from 'graphql';
import AssetListFields from '../fields/assetList';

export default new GraphQLObjectType({
  name: 'buffettDynamicContentFeedContainer',
  fields: AssetListFields,
});
