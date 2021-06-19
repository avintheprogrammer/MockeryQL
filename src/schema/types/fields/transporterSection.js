import { GraphQLList } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';
import AssetListFields from './assetList';

export default () => ({
  ...AssetListFields(),
  assets: {
    type: new GraphQLList(AssetInterfaceType),
    resolve: ({ assets }) => {
      if (Array.isArray(assets)) return assets.slice(0, 3);
      return [];
    },
  },
});
