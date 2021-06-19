import { GraphQLUnionType } from 'graphql';

import BaseAssetType from '../assets/asset';
import ModuleTypes from '../modules';

export default new GraphQLUnionType({
  name: 'moduleUnion',
  types: [BaseAssetType, ...Object.values(ModuleTypes)],
  resolveType(module = {}) {
    return ModuleTypes[module.name] || BaseAssetType; // eslint-disable-line
  },
});
