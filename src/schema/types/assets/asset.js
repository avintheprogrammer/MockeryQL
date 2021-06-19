import { GraphQLObjectType, GraphQLEnumType } from 'graphql';
import AssetInterfaceType from '../interfaces/asset';

import SharedFields from '../fields/shared';

export const AssetType = new GraphQLObjectType({
  name: 'asset',
  interfaces: () => [AssetInterfaceType],
  fields: SharedFields,
});

export const AssetTypeValuesType = new GraphQLEnumType({
  name: 'assetTypeValues',
  values: {
    blogpost: { value: 'blogpost' },
    cnbcnewsstory: { value: 'cnbcnewsstory' },
    collection: { value: 'collection' },
    partnerstory: { value: 'partnerstory' },
    pressrelease: { value: 'pressrelease' },
    slideshow: { value: 'slideshow' },
    sponsored: { value: 'sponsored' },
    wirestory: { value: 'wirestory' },
    cnbcvideo: { value: 'cnbcvideo' },
    event: { value: 'event' },
    image: { value: 'image' },
    person: { value: 'person' },
    franchise: { value: 'franchise' },
    security: { value: 'security' },
    tag: { value: 'tag' },
    webresource: { value: 'webresource' },
    webservice: { value: 'webservice' },
    wildcard: { value: 'wildcard' },
  },
});

export default AssetType;
