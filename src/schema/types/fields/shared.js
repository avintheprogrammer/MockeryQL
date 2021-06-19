/* eslint-disable consistent-return */
import { GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLString } from 'graphql';

import AssetInterfaceType from '../interfaces/asset';
import CreatorType from '../assets/creator';
import ImageType from '../assets/image';
import FeaturedMediaInterfaceType from '../assets/featuredMedia';
import FranchiseType from '../assets/franchise';
import PublisherType from '../assets/publisher';
import SectionHierarchyType from '../assets/sectionHierarchy';
import SourceType from '../assets/source';
import TagType from '../assets/tag';
import TeamType from '../assets/team';
import ProjectType from '../assets/project';
import SecurityType from '../assets/security';
import globalAppConfig from './../../../app/PhoenixQlConfig';

import {
  isPremium,
  isNative,
  resolveRelatedTags,
  resolveFormattedDatePublished,
  resolveFormattedDateLastPublished,
  resolveDateLastPublishedSixHr,
  resolveMore,
} from '../../../helpers/asset';

import {
  resolveAdditionalSectionContent,
  resolveTeam,
  resolveProject,
  resolveTagNameFormatted,
  resolveSectionHierarchy,
} from '../../../helpers/page';

import { removeSpaces } from '../../../lib/string';

const { URL_OVERRIDE } = globalAppConfig.properties;
const URLOverride = (URL_OVERRIDE && JSON.parse(URL_OVERRIDE)) || {};

export default () => ({
  id: {
    type: GraphQLInt,
  },
  type: {
    type: GraphQLString,
  },
  brand: {
    type: GraphQLString,
    resolve: ({ branding: brand = 'cnbc' }) => removeSpaces(brand).toLowerCase(),
  },
  slug: {
    type: GraphQLString,
  },
  url: {
    type: GraphQLString,
    resolve: ({ id, url }) => {
      const overWrittenURL = URLOverride[id];
      return overWrittenURL || url;
    },
  },
  liveURL: {
    type: GraphQLString,
  },
  subDomain: {
    type: GraphQLString,
  },
  contentUrl: {
    type: GraphQLString,
  },
  datePublished: {
    type: GraphQLString,
  },
  datePublishedFormatted: {
    type: GraphQLString,
    resolve: ({ datePublished }) => resolveFormattedDatePublished({ datePublished }),
  },
  dateLastPublished: {
    type: GraphQLString,
  },
  dateLastPublishedFormatted: {
    type: GraphQLString,
    resolve: ({ dateFirstPublished, dateLastPublished }) =>
      resolveFormattedDateLastPublished({ dateFirstPublished, dateLastPublished }),
  },
  dateLastPublishedSixHr: {
    type: GraphQLString,
    resolve: ({ dateLastPublished }) => resolveDateLastPublishedSixHr({ dateLastPublished }),
  },
  dateFirstPublished: {
    type: GraphQLString,
  },
  dateModified: {
    type: GraphQLString,
  },
  unpublishDate: {
    type: GraphQLString,
  },
  expires: {
    type: GraphQLString,
  },
  title: {
    type: GraphQLString,
  },
  seoTitle: {
    type: GraphQLString,
  },
  headline: {
    type: GraphQLString,
  },
  keyword: {
    type: GraphQLString,
  },
  tagName: {
    type: GraphQLString,
  },
  name: {
    type: GraphQLString,
  },
  tagNameFormatted: {
    type: GraphQLString,
    resolve: ({ tagName }) => resolveTagNameFormatted(tagName, true),
  },
  tagNameFormattedFull: {
    type: GraphQLString,
    resolve: ({ tagName }) => resolveTagNameFormatted(tagName),
  },
  description: {
    type: GraphQLString,
  },
  subType: {
    type: GraphQLString,
  },
  premium: {
    type: GraphQLBoolean,
    resolve: ({ settings }) => isPremium({ settings }),
  },
  native: {
    type: GraphQLBoolean,
    resolve: ({ settings }) => isNative({ settings }),
  },
  more: {
    type: new GraphQLList(AssetInterfaceType),
    resolve: ({ association: associations }) => resolveMore({ associations }),
  },
  sameAs: {
    type: new GraphQLList(GraphQLString),
  },
  summary: {
    type: GraphQLString,
  },
  shorterDescription: {
    type: GraphQLString,
  },
  publisher: {
    type: PublisherType,
  },
  author: {
    type: new GraphQLList(CreatorType),
    resolve: ({ author: authors = [] }) => {
      if (Array.isArray(authors)) return authors;
      return [];
    },
  },
  section: {
    type: FranchiseType,
    resolve: async ({ id, section }, _, { stores }) =>
      section || (await stores.capi.find({ id }) || {}).section,
  },
  sourceOrganization: {
    type: new GraphQLList(SourceType),
    resolve: async ({ id, sourceOrganization }, _, { stores }) =>
      sourceOrganization || (await stores.capi.find({ id })).sourceOrganization,
  },
  featuredMedia: {
    type: FeaturedMediaInterfaceType,
    args: {
      uid: {
        type: GraphQLString,
      },
      sessionToken: {
        type: GraphQLString,
      },
    },
    resolve: async ({ settings, featuredMedia }, args, { stores }) => {
      if (!isPremium({ settings })) return featuredMedia;

      const isAuthenticated = await stores.article.resolveProAuthentication(args);
      return isAuthenticated ? featuredMedia : null;
    },
  },
  promoImage: {
    type: ImageType,
    resolve: ({ image }) => image,
  },
  sectionHierarchy: {
    type: new GraphQLList(SectionHierarchyType),
    args: {
      isFiltered: {
        type: GraphQLBoolean,
      },
    },
    resolve: async (data, { isFiltered }, { stores }) => {
      const resolve = ({ sectionHierarchy, branding: brand = 'cnbc' }) =>
        resolveSectionHierarchy({ sectionHierarchy, brand, isFiltered });

      return resolve(data).length
        ? resolve(data)
        : resolve(await stores.capi.find({ id: data.id }) || {});
    },
  },
  linkHeadline: {
    type: GraphQLString,
  },
  shortestHeadline: {
    type: GraphQLString,
  },
  shorterHeadline: {
    type: GraphQLString,
  },
  creatorOverwrite: {
    type: GraphQLString,
  },
  projectTeamContent: {
    type: new GraphQLList(TeamType),
    resolve: async (data, _, { stores }) => {
      const resolve = ({ association: associations = [] }) =>
        resolveTeam({ associations });

      return resolve(data).length
        ? resolve(data)
        : resolve(await stores.capi.find({ id: data.id }) || {});
    },
  },
  projectContent: {
    type: new GraphQLList(ProjectType),
    resolve: async (data, _, { stores }) => {
      const resolve = ({ association: associations = [] }) =>
        resolveProject({ associations });

      return resolve(data).length
        ? resolve(data)
        : resolve(await stores.capi.find({ id: data.id }) || {});
    },
  },
  additionalSectionContent: {
    type: new GraphQLList(TagType),
    resolve: async (data, _, { stores }) => {
      const resolve = ({ association: associations = [] }) =>
        resolveAdditionalSectionContent({ associations });

      return resolve(data).length
        ? resolve(data)
        : resolve(await stores.capi.find({ id: data.id }) || {});
    },
  },
  commentsEnabled: {
    type: GraphQLBoolean,
    resolve: ({ settings = {} }) => {
      const { commentsEnabled = 'Yes' } = settings;
      return commentsEnabled === 'Yes';
    },
  },
  socialtoolsEnabled: {
    type: GraphQLBoolean,
    resolve: ({ settings = {} }) => {
      const { socialtoolsEnabled = 'Yes' } = settings;
      return socialtoolsEnabled === 'Yes';
    },
  },
  dateline: {
    type: GraphQLBoolean,
    resolve: ({ settings = {} }) => {
      const { dateline = 'Yes' } = settings;
      return dateline === 'Yes';
    },
  },
  displayByline: {
    type: GraphQLBoolean,
    resolve: ({ settings = {} }) => {
      const { displayByline = 'Yes' } = settings;
      return displayByline === 'Yes';
    },
  },
  displaySource: {
    type: GraphQLBoolean,
    resolve: ({ settings = {} }) => {
      const { displaySource = 'Yes' } = settings;
      return displaySource === 'Yes';
    },
  },
  outbrainEnabled: {
    type: GraphQLBoolean,
    resolve: ({ settings = {} }) => {
      const { outbrainEnabled = {} } = settings;
      return outbrainEnabled === 'Yes';
    },
  },
  listType: {
    type: GraphQLString,
    resolve: ({ settings = {} }) => {
      const { listType } = settings;
      return listType;
    },
  },
  tweetOnPublish: {
    type: GraphQLInt,
    resolve: ({ settings = {} }) => {
      const { tweetOnPublish = 0 } = settings;
      return tweetOnPublish;
    },
  },
  relatedTags: {
    type: new GraphQLList(TagType),
    args: {
      count: {
        type: GraphQLInt,
      },
      promotedOnly: {
        type: GraphQLBoolean,
      },
    },
    resolve: async (data, { count, promotedOnly }, { stores }) => {
      const resolve = ({ association: associations = [], tag: tags = [] }) => {
        if (tags.length) return count ? (tags).slice(0, count) : tags;
        const relatedTags = resolveRelatedTags({ associations, promotedOnly });
        return count ? relatedTags.slice(0, count) : relatedTags;
      };

      return resolve(data).length
        ? resolve(data)
        : resolve(await stores.capi.find({ id: data.id }) || {});
    },
  },
  tickerSymbols: {
    type: new GraphQLList(SecurityType),
    resolve: ({ tickerSymbol }) => tickerSymbol,
  },
});
