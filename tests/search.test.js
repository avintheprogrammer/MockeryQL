import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const articleFields = `
  id
  type
  slug
  datePublished
  description
  headline
  title
  tickerSymbols {
    id
    type
    symbol
    chartSymbol
  }
`;

const articleFamilyFields = `
  ... on blogpost { ${articleFields} }
  ... on cnbcnewsstory  { ${articleFields} }
  ... on partnerstory { ${articleFields} }
  ... on pressrelease  { ${articleFields} }
  ... on slideshow { ${articleFields} }
  ... on sponsored { ${articleFields} }
  ... on wirestory { ${articleFields} }
`;

const searchResultFields = `
  ${articleFamilyFields}
  ... on cnbcvideo {
    type
    brand
    publisher {
      name
      logo
    }
    show
    encodings {
      url
      encodingFormat
      bitrate
    }
    usagePlans
  }
  ... on event {
    type
    author {
      name
      sameAs
    }
    articlebody
    brand
  }
  ... on image {
    type
    id
    type
    slug
    datePublished
    description
    headline
  }
  ... on person {
    type
    headline
    brand
    socialMediaInfo {
      url
      displayText
      type
    }
    sameAs
    native
  }
  ... on franchise {
    type
    brand
    headline
    name
    navigation {
      id
    }
    image {
      url
    }
  }
  ... on security {
    type
    name
    brand
    exchangeName
    tickerSymbol
    sourceOrganization {
      id
    }
  }
  ... on wildcard {
    type
    headline
    slug
    description
    brand
    native
    premium
    publisher {
      name
      logo
    }
    datePublished
  }

`;

const queryableFields = `
    results {
      ${searchResultFields}
    }
    pagination {
      page
      pageSize
      totalCount
    }
    metadata {
      q
      totalResults
      pageSize
      totalPage
      pageRequested
      corrections
      stems
      suggestions,
      facetSuggestions,
      related
      resultGenerationTime
    }
    filters {
      author {
        key
        count
      }
      resultType {
        key
        count
      }
      section {
        key
        count
      }
      dateRange {
        key
        count
      }
    }
    tags {
      group
      results {
        ${searchResultFields}
      }
      totalResults
    }
`;

const getSearchMockData = (fileName) => {
  const CAPISearchMock = require(`./mocks/capi/${fileName}.json`);
  const PhoenixQLSearchMock = require(`./mocks/search/${fileName}.json`);

  return {
    CAPISearchMock,
    PhoenixQLSearchMock,
  };
};

describe('Search', () => {
  describe('Given a search for `bitcoin` with page=1 and pageSize=5', () => {
    const keyword = 'bitcoin';
    const page = 1;
    const pageSize = 5;
    const query = `
      query {
        search(q: "${keyword}", page: ${page}, pageSize: ${pageSize}) {
          ${queryableFields}
        }
      }
    `;
    const fileName = `search-${keyword}`;
    const { CAPISearchMock, PhoenixQLSearchMock } = getSearchMockData(fileName);

    nock(nockHost)
      .persist()
      .get(new RegExp('/search?.*'))
      .reply(200, CAPISearchMock);

    it('returns queryable fields', async () => {
      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLSearchMock));
    });

    it('should contain pagination', async () => {
      const resp = await graphql(Schema, query, {}, createContext());
      const { data: { search: { pagination } } } = resp;

      expect(pagination).toEqual({
        page: 1,
        pageSize: 5,
        totalCount: 136,
      });
    });

    it('should contain metadata', async () => {
      const resp = await graphql(Schema, query, {}, createContext());
      const { data: { search: { metadata } } } = resp;

      expect(metadata).toEqual({
        q: 'bitcoin',
        totalResults: 136,
        pageSize: 5,
        totalPage: 28,
        pageRequested: 1,
        corrections: [],
        stems: [
          'bitcoin',
        ],
        suggestions: [
          'Bitcoin',
          'bitcoins',
          'bitcoin\'s',
          'bitcoin2x',
          'bitcoin.Bitcoin',
        ],
        facetSuggestions: [
          {
            facet: 'tags:topic',
            suggestions: [
              'Bitcoin',
            ],
          },
        ],
        related: [],
        resultGenerationTime: '7.0004 ms',
      });
    });

    it('should contain filters for `author`', async () => {
      const resp = await graphql(Schema, query, {}, createContext());
      const { data: { search: { filters } } } = resp;

      expect(filters.author).toEqual([
        { key: 'Evelyn Cheng', count: 124 },
        { key: 'Stephanie Landsman', count: 115 },
        { key: 'Arjun Kharpal', count: 109 },
        { key: 'Jacob Pramuk', count: 83 },
        { key: 'Jeff Cox', count: 59 },
        { key: 'Christine Wang', count: 54 },
        { key: 'Peter Schacknow', count: 52 },
        { key: 'Luke Graham', count: 41 },
        { key: 'Ryan Browne', count: 41 },
        { key: 'Matthew J. Belvedere', count: 39 },
      ]);
    });

    it('should contain filters for `resultType`', async () => {
      const resp = await graphql(Schema, query, {}, createContext());
      const { data: { search: { filters } } } = resp;

      expect(filters.resultType).toEqual([
        { key: 'cnbcnewsstory', count: 941 },
        { key: 'image', count: 728 },
        { key: 'cnbcvideo', count: 469 },
        { key: 'blogpost', count: 361 },
        { key: 'wirestory', count: 67 },
        { key: 'partnerstory', count: 49 },
        { key: 'pressrelease', count: 17 },
        { key: 'wildcard', count: 10 },
        { key: 'chart', count: 7 },
        { key: 'franchise', count: 7 }, // franchise ???!??
      ]);
    });

    it('should contain filters for `section`', async () => {
      const resp = await graphql(Schema, query, {}, createContext());
      const { data: { search: { filters } } } = resp;

      expect(filters.section).toEqual([
        { key: 'Fast Money', count: 395 },
        { key: 'Tech Transformers', count: 160 },
        { key: 'Markets', count: 111 },
        { key: 'Technology', count: 102 },
        { key: 'The Bottom Line', count: 88 },
        { key: 'Bitcoin', count: 67 },
        { key: 'Wires', count: 64 },
        { key: 'Digital Original', count: 47 },
        { key: 'morning brief', count: 45 },
        { key: 'Investing', count: 39 },
      ]);
    });

    it('should contain filters for `dateRange`', async () => {
      const resp = await graphql(Schema, query, {}, createContext());
      const { data: { search: { filters } } } = resp;

      expect(filters.dateRange).toEqual([
        { key: 'past one year', count: 1377 },
        { key: 'past 7 days', count: 1 },
        { key: 'today', count: null },
      ]);
    });
  });
});
