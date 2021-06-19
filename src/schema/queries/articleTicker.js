import {
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

import AssetList from '../types/assets/assetList';
import astToFragmentTypes from '../../lib/astToFragmentTypes';

export default {
  type: AssetList,
  args: {
    articleID: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    page: {
      type: GraphQLInt,
    },
    pageSize: {
      type: GraphQLInt,
    },
  },
  resolve(_, { articleID: id, page, pageSize }, { stores }, info) {
    const assetTypes = astToFragmentTypes({ ast: info.fieldNodes });
    const options = { page, pageSize, include: assetTypes };
    return stores.articleTicker.find({ id }, options);
  },
};
