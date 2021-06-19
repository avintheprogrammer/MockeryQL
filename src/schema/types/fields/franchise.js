import { GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import AssetInterfaceType from '../interfaces/asset';
import { AssetType, AssetTypeValuesType } from '../assets/asset';
import contentClassificationValues from '../assets/contentClassification';
import FranchiseType from '../assets/franchise';
import ImageType from '../assets/image';
import NavigationType from '../assets/navigation';
import WebresourceType from '../assets/webresource';
import astToFragmentTypes from '../../../lib/astToFragmentTypes';

import SharedFields from './shared';
import AnalyticsFields from './analytics';

import { resolveContent, resolveRelated } from '../../../helpers/asset';
import {
  resolveSectionLogo,
  resolveSectionNav,
  resolveCarousel,
  resolveHeaderImage,
  resolvePromoBucket,
  resolveRelatedContent,
} from '../../../helpers/section';

export default () => ({
  ...SharedFields(),
  ...AnalyticsFields(),
  name: {
    type: GraphQLString,
  },
  color: {
    type: GraphQLString,
    resolve: ({ sectionColor }) => sectionColor,
  },
  image: {
    type: ImageType,
  },
  eyebrow: {
    type: GraphQLString,
    resolve: ({
      shorterHeadline,
      linkHeadline,
      title,
    }) => shorterHeadline || linkHeadline || title,
  },
  logo: {
    type: ImageType,
    resolve: ({ association: associations = [], sectionLogo = {} }) => {
      if (associations.length) return resolveSectionLogo({ associations });
      return sectionLogo;
    },
  },
  body: {
    type: GraphQLJSON,
    resolve: ({ xmlArticleBody: xml, association: associations = [] }) => (
      resolveContent({ xml, associations })
    ),
  },
  keyPoints: {
    type: GraphQLJSON,
    resolve: ({ xmlKeyPoints: xml, association: associations = [] }) => (
      resolveContent({ xml, associations })
    ),
  },
  navigation: {
    type: new GraphQLList(NavigationType),
    resolve: ({ association: associations = [] }) => resolveSectionNav({ associations }),
  },
  carousel: {
    type: new GraphQLList(FranchiseType),
    resolve: ({ association: associations = [] }) => resolveCarousel({ associations }),
  },
  sectionLabel: {
    type: GraphQLString,
  },
  sectionLinktext: {
    type: GraphQLString,
  },
  tabLabel: {
    type: GraphQLString,
  },
  showTime: {
    type: GraphQLString,
  },
  headerImage: {
    type: ImageType,
    resolve: ({ association: associations = [], sectionHeader = {} }) => {
      if (associations.length) return resolveHeaderImage({ associations });
      return sectionHeader;
    },
  },
  related: {
    type: new GraphQLList(AssetInterfaceType),
    resolve: ({ association: associations = [] }) => resolveRelated({ associations }),
  },
  assets: {
    type: new GraphQLList(AssetInterfaceType),
    args: {
      count: {
        type: GraphQLInt,
      },
      page: {
        type: GraphQLInt,
      },
      offset: {
        type: GraphQLInt,
      },
      mode: {
        type: GraphQLString,
      },
      includeContentTypes: {
        type: new GraphQLList(AssetTypeValuesType),
      },
      excludeContentTypes: {
        type: new GraphQLList(AssetTypeValuesType),
      },
      excludeContentClassification: {
        type: new GraphQLList(contentClassificationValues),
      },
      promoted: {
        type: GraphQLBoolean,
      },
    },
    resolve: async (
      { id, appliedQS },
      { count, page, offset, mode, includeContentTypes = [], excludeContentTypes = [],
        excludeContentClassification = [], promoted },
      { stores },
      info,
    ) => {
      // Detect asset types
      const assetTypes = (!excludeContentTypes || !excludeContentTypes.length)
        ? (includeContentTypes || astToFragmentTypes({ ast: info.fieldNodes }))
        : [];
      const commaSeparatedContentValues = excludeContentClassification.join(',');

      const options = {
        pageSize: count,
        page,
        offset,
        mode,
        include: assetTypes,
        exclude: excludeContentTypes,
        excludeContentClassification: commaSeparatedContentValues,
        promoted,
        ...appliedQS,
      };

      const { assets } = await stores.assetList.find({ id }, options) || {};
      return assets;
    },
  },
  webresource: {
    type: new GraphQLList(WebresourceType),
    resolve: ({ association: associations = [] }) => (
      associations.filter(({ type = '' }) => type === 'webresource')
    ),
  },
  promoBucket: {
    type: new GraphQLList(AssetType),
    args: {
      type: {
        type: AssetTypeValuesType,
      },
    },
    resolve: ({ association: associations = [] }, { type = '' }) => (
      resolvePromoBucket({ associations }, { type })
    ),
  },
  relatedContent: {
    type: new GraphQLList(AssetInterfaceType),
    args: {
      count: {
        type: GraphQLInt,
      },
    },
    resolve: ({ association: associations = [] }, { count }) => (
      count
        ? resolveRelatedContent({ associations }).slice(0, count)
        : resolveRelatedContent({ associations })),
  },
});
