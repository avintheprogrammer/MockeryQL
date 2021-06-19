import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import AssetList from '../types/assets/assetList';
import astToFragmentTypes from '../../lib/astToFragmentTypes';

export default {
  type: AssetList,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    page: {
      type: GraphQLInt,
    },
    pageSize: {
      type: GraphQLInt,
    },
    offset: {
      type: GraphQLInt,
    },
    promoted: {
      type: GraphQLBoolean,
    },
    include: {
      type: new GraphQLList(GraphQLString),
    },
    exclude: {
      type: new GraphQLList(GraphQLString),
    },
  },
  async resolve(_, { id, page, pageSize, promoted, offset, include, exclude }, { stores }, info) {
    // Detect asset types
    const assetTypes = !exclude ? (include || astToFragmentTypes({ ast: info.fieldNodes })) : [];

    const options = {
      page,
      pageSize,
      offset,
      promoted,
      include: assetTypes,
      exclude,
    };

    return stores.assetList.find({ id }, options);
  },
};
