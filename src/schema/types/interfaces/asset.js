import { GraphQLInterfaceType } from 'graphql';

import { ArticleSubtypes } from '../assets/article';
import BaseAssetType from '../assets/asset';
import CollectionType from '../assets/collection';
import CreatorType from '../assets/creator';
import EventType from '../assets/event';
import ImageType from '../assets/image';
import PersonType from '../assets/person';
import FranchiseType from '../assets/franchise';
import SecurityType from '../assets/security';
import TagType from '../assets/tag';
import VideoType from '../assets/video';
import WebresourceType from '../assets/webresource';
import WebserviceType from '../assets/webservice';
import WildcardType from '../assets/wildcard';

import SharedFields from '../fields/shared';

// created as a function to avoid ArticleSubtypes being null or undefined
const AssetTypes = () => ({
  ...ArticleSubtypes,
  collection: CollectionType,
  company: SecurityType,
  cnbcvideo: VideoType,
  creator: CreatorType,
  event: EventType,
  franchise: FranchiseType,
  image: ImageType,
  person: PersonType,
  tag: TagType,
  security: SecurityType,
  webresource: WebresourceType,
  webservice: WebserviceType,
  wildcard: WildcardType,
});

export default new GraphQLInterfaceType({
  name: 'assetInterface',
  fields: () => ({
    ...SharedFields(),
  }),
  resolveType(asset = {}) {
    return AssetTypes()[asset.type] || BaseAssetType; // eslint-disable-line
  },
});
