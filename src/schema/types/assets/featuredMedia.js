import { GraphQLInterfaceType } from 'graphql';
import ImageType from '../assets/image';
import VideoType from '../assets/video';

import SharedFields from '../fields/shared';

const FeaturedMediaTypes = {
  image: ImageType,
  cnbcvideo: VideoType,
};

const FeaturedMediaFields = () => (
  Object.entries(SharedFields()).reduce((resolved, field) => {
    const [key, value] = field;

    // can't have the shared featuredMedia field as a featuredMedia field
    // because that's a circular dependency
    if (key === 'featuredMedia') return resolved;

    resolved[key] = value; // eslint-disable-line
    return resolved;
  }, {})
);

const FeaturedMediaInterfaceType = new GraphQLInterfaceType({
  name: 'featuredMedia',
  fields: FeaturedMediaFields,
  resolveType(featuredMedia = {}) {
    return FeaturedMediaTypes[featuredMedia.type] || ImageType;
  },
});

export default FeaturedMediaInterfaceType;
