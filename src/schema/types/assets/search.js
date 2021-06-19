import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import AssetInterfaceType from '../interfaces/asset';
import PaginationType from './pagination';

const SearchMatchFilter = new GraphQLObjectType({
  name: 'searchMatchFilter',
  fields: {
    key: {
      type: GraphQLString,
    },
    count: {
      type: GraphQLInt,
    },
  },
});

const SearchFilterType = new GraphQLObjectType({
  name: 'searchFilter',
  fields: {
    author: {
      type: new GraphQLList(SearchMatchFilter),
    },
    section: {
      type: new GraphQLList(SearchMatchFilter),
    },
    dateRange: {
      type: new GraphQLList(SearchMatchFilter),
    },
    resultType: {
      type: new GraphQLList(SearchMatchFilter),
    },
  },
});

const SearchMetataDataType = new GraphQLObjectType({
  name: 'searchMetadata',
  fields: {
    suggestions: {
      type: new GraphQLList(GraphQLString),
    },
    q: {
      type: GraphQLString,
    },
    totalResults: {
      type: GraphQLInt,
      resolve: ({ totalresults }) => totalresults,
    },
    pageSize: {
      type: GraphQLInt,
      resolve: ({ pagesize }) => pagesize,
    },
    totalPage: {
      type: GraphQLInt,
      resolve: ({ totalpage }) => totalpage,
    },
    pageRequested: {
      type: GraphQLInt,
      resolve: ({ pagerequested }) => pagerequested,
    },
    corrections: {
      type: GraphQLJSON,
    },
    stems: {
      type: new GraphQLList(GraphQLString),
    },
    facetSuggestions: {
      type: GraphQLJSON,
      resolve: ({ facetsuggestions }) => facetsuggestions,
    },
    related: {
      type: GraphQLJSON,
    },
    resultGenerationTime: {
      type: GraphQLString,
      resolve: ({ resultgenerationtime }) => resultgenerationtime,
    },
  },
});

const SearchTagsType = new GraphQLObjectType({
  name: 'searchTags',
  fields: {
    group: {
      type: GraphQLString,
    },
    totalResults: {
      type: GraphQLInt,
    },
    results: {
      type: new GraphQLList(AssetInterfaceType),
    },
  },
});

const InternalMetadata = new GraphQLObjectType({
  name: 'internalMetadata',
  fields: {
    sourceQuery: {
      type: GraphQLString,
    },
  },
});

const GroupType = new GraphQLEnumType({
  name: 'group',
  values: {
    ticker: { value: 'ticker' },
    section: { value: 'franchise' },
    person: { value: 'person' },
    creator: { value: 'creator' },
  },
});

function resolveSearchTags({ tags = [], group = [] }) {
  if (!group.length) return tags;
  return tags.filter(tag => group.includes(tag.group));
}

export default new GraphQLObjectType({
  name: 'searchType',
  fields: () => ({
    results: {
      type: new GraphQLList(AssetInterfaceType),
    },
    pagination: {
      type: PaginationType,
    },
    metadata: {
      type: SearchMetataDataType,
    },
    filters: {
      type: SearchFilterType,
    },
    tags: {
      type: new GraphQLList(SearchTagsType),
      args: {
        group: {
          type: new GraphQLList(GroupType),
        },
      },
      resolve: ({ tags }, { group }) => resolveSearchTags({ tags, group }),
    },
    internalMetadata: {
      type: InternalMetadata,
      resolve: (root) => root,
    },
  }),
});
