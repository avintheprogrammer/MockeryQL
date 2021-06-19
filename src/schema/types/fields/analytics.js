/* eslint-disable consistent-return */
import { GraphQLList, GraphQLString, GraphQLBoolean } from 'graphql';

import TagType from '../assets/tag';

import { resolveRelatedTags } from '../../../helpers/asset';
import {
  resolveAdditionalSectionContent,
  resolveTeam,
  resolveProject,
  resolveSectionHierarchy,
  resolveRelatedContent,
  resolveTagNameFormatted,
} from '../../../helpers/page';
import { resolveVideoStatus, resolveUsageRule, resolveAirDate, resolveComScoreC4, resolveComScoreC6 } from '../../../helpers/video';
import { resolvePageName, formatDate } from '../../../helpers/analytics';

import mpsTagsAssetTypes from '../../../config/mpsTagsAssetTypes.json';

const TAG_NAME_DEFAULT = 'NA';

function filterByTypes(association = {}) {
  return mpsTagsAssetTypes.includes(association.type);
}

function resolveFormatArray(array = [], isTruncated) {
  return (array || [])
    .filter(val => val.tagName)
    .map(val => resolveTagNameFormatted(val.tagName, isTruncated))
    .join('|') || TAG_NAME_DEFAULT;
}

export function resolveHier1({ sectionHierarchyArray = [] }) {
  if (sectionHierarchyArray.length) {
    return resolveTagNameFormatted(sectionHierarchyArray[0].tagName, true);
  }
  return TAG_NAME_DEFAULT;
}

export default () => ({
  sectionHierarchyFormatted: {
    type: GraphQLString,
    args: {
      isFiltered: {
        type: GraphQLBoolean,
      },
      isTruncated: {
        type: GraphQLBoolean,
      },
    },
    resolve: ({ sectionHierarchy, branding: brand = 'cnbc' }, { isFiltered, isTruncated }) =>
      resolveFormatArray(
        resolveSectionHierarchy({ sectionHierarchy, brand, isFiltered }),
        isTruncated,
      ),
  },
  hier1Formatted: {
    type: GraphQLString,
    resolve: ({ sectionHierarchy }) => {
      const sectionHierarchyArray = resolveSectionHierarchy({ sectionHierarchy });
      return resolveHier1({ sectionHierarchyArray });
    },
  },
  additionalSectionContentFormatted: {
    type: GraphQLString,
    args: {
      isTruncated: {
        type: GraphQLBoolean,
      },
    },
    resolve: async (data, { isTruncated }, { stores }) => {
      const resolve = ({ association: associations = [] }) => {
        const additionalSection = resolveAdditionalSectionContent({ associations });
        return resolveFormatArray(additionalSection, isTruncated);
      };

      return resolve(data) === TAG_NAME_DEFAULT
        ? resolve(await stores.capi.find({ id: data.id }) || {})
        : resolve(data);
    },
  },
  relatedTagsFiltered: {
    type: new GraphQLList(TagType),
    resolve: async (data, _, { stores }) => {
      const resolve = ({ association: associations = [] }) =>
        resolveRelatedTags({ associations }).filter(filterByTypes);

      return resolve(data).length
        ? resolve(data)
        : resolve(await stores.capi.find({ id: data.id }) || {});
    },
  },
  relatedTagsFilteredFormatted: {
    type: GraphQLString,
    args: {
      isTruncated: {
        type: GraphQLBoolean,
      },
    },
    resolve: async (data, { isTruncated }, { stores }) => {
      const resolve = ({ association: associations = [] }) => {
        const tags = resolveRelatedTags({ associations });
        return resolveFormatArray(tags, isTruncated);
      };

      return resolve(data) === TAG_NAME_DEFAULT
        ? resolve(await stores.capi.find({ id: data.id }) || {})
        : resolve(data);
    },
  },
  relatedContentFiltered: {
    type: new GraphQLList(TagType),
    resolve: ({ association: associations = [] }) => (
      resolveRelatedContent({ associations }).filter(filterByTypes)
    ),
  },
  projectTeamContentFormatted: {
    type: GraphQLString,
    args: {
      isTruncated: {
        type: GraphQLBoolean,
      },
    },
    resolve: ({ association: associations = [] }, { isTruncated }) => {
      const team = resolveTeam({ associations });
      return resolveFormatArray(team, isTruncated);
    },
  },
  projectContentFormatted: {
    type: GraphQLString,
    args: {
      isTruncated: {
        type: GraphQLBoolean,
      },
    },
    resolve: ({ association: associations = [] }, { isTruncated }) => {
      const project = resolveProject({ associations });
      return resolveFormatArray(project, isTruncated);
    },
  },
  creatorOverwriteFormatted: {
    type: GraphQLString,
    resolve: ({ creatorOverwrite }) => resolveTagNameFormatted(creatorOverwrite, true),
  },
  sourceOrganizationFormatted: {
    type: GraphQLString,
    args: {
      isTruncated: {
        type: GraphQLBoolean,
      },
    },
    resolve: async (data, { isTruncated }, { stores }) => {
      const resolve = ({ sourceOrganization = [] }) =>
        resolveFormatArray(sourceOrganization, isTruncated);

      return resolve(data) === TAG_NAME_DEFAULT
        ? resolve(await stores.capi.find({ id: data.id }) || {})
        : resolve(data);
    },
  },
  authorFormatted: {
    type: GraphQLString,
    args: {
      isTruncated: {
        type: GraphQLBoolean,
      },
    },
    resolve: ({ author = [] }, { isTruncated }) => resolveFormatArray(author, isTruncated),
  },
  dayPart: {
    type: GraphQLString,
    resolve: () => 'Others',
  },
  network: {
    type: GraphQLString,
    resolve: () => 'CNBC',
  },
  platform: {
    type: GraphQLString,
    resolve: () => 'web',
  },
  playerTech: {
    type: GraphQLString,
    resolve: () => 'JW Player',
  },
  videoStatus: {
    type: GraphQLString,
    resolve: ({ settings }) => resolveVideoStatus({ settings }),
  },
  usageRule: {
    type: GraphQLString,
    resolve: ({ settings }) => resolveUsageRule({ settings }),
  },
  airDate: {
    type: GraphQLString,
    resolve: ({ datePublished }) => resolveAirDate(datePublished),
  },
  pageName: {
    type: GraphQLString,
    resolve: ({ id, liveURL, type, vcpsId }) => {
      const assetId = (type === 'cnbcvideo' && vcpsId) ? vcpsId : id;
      return resolvePageName(assetId, liveURL);
    },
  },
  comScoreC2: {
    type: GraphQLString,
    resolve: () => '1000004',
  },
  comScoreC3: {
    type: GraphQLString,
    resolve: () => '*null',
  },
  comScoreC4: {
    type: GraphQLString,
    resolve: ({ branding, settings }) => resolveComScoreC4(branding, settings),
  },
  comScoreC6: {
    type: GraphQLString,
    resolve: () => resolveComScoreC6(),
  },
  shortDatePublished: {
    type: GraphQLString,
    resolve: ({ datePublished }) => formatDate(datePublished),
  },
  shortDateLastPublished: {
    type: GraphQLString,
    resolve: ({ dateLastPublished }) => formatDate(dateLastPublished),
  },
  shortDateFirstPublished: {
    type: GraphQLString,
    resolve: ({ dateFirstPublished }) => formatDate(dateFirstPublished),
  },
});
