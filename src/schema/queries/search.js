import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLList,
} from 'graphql';
import Search from '../types/assets/search';
import { AssetTypeValuesType } from '../types/assets/asset';

// Docs: https://nbcnewsdigital.atlassian.net/wiki/spaces/CNBCDD/pages/330399770/Core+Services
//       https://nbcnewsdigital.atlassian.net/wiki/spaces/carbon/pages/72122616/CMS+Search

// Remove CMS specific: staticcontent, keywords, id, (associatedContent ?)

// Filter namne |  CAPI input name | graphql input
//  author      -> author         -> author
//  section     -> section        -> section
//  dateRange   -> ?              -> ???
//  resultType  -> contentType    -> contentType makes more sense?

const SearchSortByType = new GraphQLEnumType({
  name: 'searchSortBy',
  values: {
    relevance: { value: 'relevance' },
    createdDate: { value: 'createdDate' },
    dateline: { value: 'dateline' },
    lastPubDate: { value: 'lastPubDate' },
    updatedDate: { value: 'updatedDate' },
    unpublishDate: { value: 'unpublishDate' },
    author: { value: 'author' },
    videoDuration: { value: 'videoDuration' },
    state: { value: 'state' },
  },
});

const SearchDateType = new GraphQLEnumType({
  name: 'searchDate',
  values: {
    createdDate: { value: 'createdDate' },
    dateFirstPublished: { value: 'dateFirstPublished' },
    updatedDate: { value: 'updatedDate' },
    unpublishDate: { value: 'unpublishDate' },
    dateline: { value: 'dateline' },
  },
});

const SearchBrandType = new GraphQLEnumType({
  name: 'searchBrand',
  values: {
    cnbc: { value: 'cnbc' },
    makeit: { value: 'makeit' },
    buffett: { value: 'buffett' },
  },
});

const SearchIndexType = new GraphQLEnumType({
  name: 'searchIndex',
  values: {
    current: { value: 'current' },
    published: { value: 'published' },
  },
});

const SearchStateType = new GraphQLEnumType({
  name: 'searchState',
  values: {
    publish: { value: 'Publish' },
    draft: { value: 'Draft' },
    revised: { value: 'Revised' },
    unpublished: { value: 'Un-Published' },
  },
});

const SearchTimeUnitType = new GraphQLEnumType({
  name: 'searchTimeUnit',
  values: {
    day: { value: 'd' },
    hour: { value: 'h' },
  },
});

// TODO: maybe move it SectionSubtypeType within Section!?
const SearchSectionSubtypeType = new GraphQLEnumType({
  name: 'searchSectionSubtype',
  values: {
    blog: { value: 'blog' }, // to confirm id
    specialReport: { value: 'special_report' },
    newsShow: { value: 'news_section' }, // to confirm id for: News Show (news_section???)
    primetimeShow: { value: 'primetime_show' }, // to confirm id for: Primetime Show
    originalShow: { value: 'original_show' },
    weeklyShow: { value: 'weekly_show' }, // ?
    feedPromotedShow: { value: 'feed_promoted' }, // to confirm id
    video: { value: 'video' }, // to confirm id for: Video Section
    markets: { value: 'markets' }, // to confirm id for: Market Sections
    modulead1: { value: 'modulead1' },
    collection: { value: 'collection' },
  },
});

const SearchUsageRuleType = new GraphQLEnumType({
  name: 'searchUsageRule',
  values: {
    native: { value: 'Native' },
    nativeUsageRule: { value: 'Native Usage rule' },
    videoAndAudio: { value: 'Video and Audio' },
    liveBlog: { value: 'Live Blog' },
    primeOnly: { value: 'Prime Only' },
    premium: { value: 'Premium' },
    premiumsUsageRule: { value: 'Premium Usage Rule' },
    notFamilyFriendly: { value: 'not-family-friendly' },
    webOnly: { value: 'web-only' },
  },
});

// Like enum of 200 sources ???
// If this list is more or less fixed, it's worth enumerating -> self-documenting
//
// const SearchSourceType = new GraphQLEnumType({
//   name: 'searchSource',
// })

const emptySearchResult = {
  results: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 0,
  },
  metadata: {
    suggestions: [],
  },
  filters: {
    author: [],
    resultType: [],
    section: [],
    dateRange: [],
  },
  tags: [],
};

export default {
  type: Search,
  args: {
    q: {
      type: GraphQLString,
    },
    pageSize: {
      type: GraphQLInt,
    },
    page: {
      type: GraphQLInt,
    },
    brand: {
      type: SearchBrandType,
    },
    partner: {
      type: GraphQLString,
    },
    contentType: {
      type: new GraphQLList(AssetTypeValuesType),
    },
    sectionSubType: {
      type: SearchSectionSubtypeType,
    },
    dateType: {
      type: SearchDateType,
    },
    timePeriod: {
      type: GraphQLString,
    },
    timeUnit: {
      type: SearchTimeUnitType,
    },
    fromDate: {
      type: GraphQLString,
    },
    toDate: {
      type: GraphQLString,
    },
    author: {
      type: GraphQLString,
    },
    source: {
      type: GraphQLString,
    },
    usageRule: {
      type: SearchUsageRuleType,
    },
    section: {
      type: GraphQLString,
    },
    secondarySection: {
      type: GraphQLString,
    },
    tag: {
      type: GraphQLString,
    },
    topic: {
      type: GraphQLString,
    },
    company: {
      type: GraphQLString,
    },
    symbol: {
      type: GraphQLString,
    },
    person: {
      type: GraphQLString,
    },
    state: {
      type: SearchStateType,
    },
    sortBy: {
      type: SearchSortByType,
    },
    asc: {
      type: GraphQLBoolean,
    },
    index: {
      type: SearchIndexType,
    },
    place: {
      type: GraphQLString,
    },
    searchEngine: {
      type: GraphQLInt,
    },
  },
  async resolve(_, args, { stores }) {
    const {
      asc,
      author,
      company,
      dateType,
      format,
      fromDate,
      index,
      page,
      pageSize,
      partner,
      person,
      place,
      q,
      searchEngine,
      secondarySection,
      section,
      sectionSubType,
      sortBy,
      source,
      state,
      symbol,
      tag,
      timePeriod,
      timeUnit,
      toDate,
      topic,
      usageRule,
    } = args;

    const includeTypes = Array.isArray(args.contentType) ? `<O>${args.contentType.join('<O>')}` : '';

    let resp = await stores.search.find({ q }, {
      asc,
      author,
      company,
      contentType: includeTypes,
      dateType,
      format,
      fromDate,
      index,
      page,
      pageSize,
      partner,
      person,
      place,
      searchEngine,
      secondarySection,
      section,
      sectionSubType,
      sortBy,
      source,
      state,
      symbol,
      tag,
      timePeriod,
      timeUnit,
      toDate,
      topic,
      usageRule,
    });

    if (resp && resp.metadata) {
      // Extract pagination data and return it as top-level
      const { metadata } = resp;
      resp.pagination = {
        page: metadata.currentPage,
        pageSize: metadata.pageSize,
        totalCount: metadata.totalCount,
      };
    } else {
      resp = emptySearchResult;
    }
    return resp;
  },
};
