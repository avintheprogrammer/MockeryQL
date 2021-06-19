import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id
  type
  slug
  url
  contentUrl
  datePublished
  subType
  name
  description
  publisher {
    name
    logo
  }
  pagination {
    link
    page
    totalCount
    pageSize
  }
  assets {
    ...on partnerstory {
      id
      type
      slug
      datePublished
      description
      headline
      title
      keyPoints
    }
    ...on cnbcnewsstory {
      id
      type
      slug
      datePublished
      description
      headline
      title
      keyPoints
    }
    ... on wildcard {
      id
      type
      slug
      datePublished
      promoText
    }
  }
`;

// TODO: Add remaining article types
describe('Asset List', () => {
  it('should return an assetList', async () => {
    const id = 100010507;
    const page = 1;
    const pageSize = 2;
    const CAPIAssetListMock = require(`./mocks/capi/${id}/default.json`);
    const PhoenixQLAssetListMock = require(`./mocks/assetList/${id}/inlineFragmentsOnly.json`);

    nock(nockHost)
      .get(new RegExp(`/list/id/${id}?.*`))
      .reply(200, CAPIAssetListMock);

    const query = `
      query {
        assetList(id: ${id}, page: ${page}, pageSize: ${pageSize}) {
          ${queryableFields}
          summary
          shorterDescription
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetListMock));
  });

  it('should return an assetList of only promoted assets', async () => {
    const id = 100010507;
    const page = 1;
    const pageSize = 10;
    const CAPIAssetListMock = require(`./mocks/capi/${id}/promotedParameter.json`);
    const PhoenixQLAssetListMock = require(`./mocks/assetList/${id}/promotedParameter.json`);

    nock(nockHost)
      .get(new RegExp(`/list/id/${id}?.*`))
      .reply(200, CAPIAssetListMock);

    const query = `
      query {
        assetList(id: ${id}, page: ${page}, pageSize: ${pageSize}, promoted: true) {
          ${queryableFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetListMock));
  });

  it('should return null for an invalid id', async () => {
    const id = 1000105071;
    const page = 1;
    const pageSize = 2;
    const PhoenixQLAssetListMock = require(`./mocks/assetList/${id}.json`);

    nock(nockHost)
      .get(new RegExp(`list/id/${id}?.*`))
      .replyWithError({ code: 503 });

    const query = `
      query {
        assetList(id: ${id}, page: ${page}, pageSize: ${pageSize}) {
          ${queryableFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetListMock));
  });

  describe('query variations', () => {
    it('should let you query for all the fields at once and include all types if no include or exclude parameters are present', async () => {
      const id = 100010507;
      const page = 1;
      const pageSize = 2;
      const CAPIAssetListMock = require(`./mocks/capi/${id}/default.json`);
      const PhoenixQLAssetListMock = require(`./mocks/assetList/${id}/noIncludeOrExcludeParameter.json`);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id}?.*`))
        .reply(200, CAPIAssetListMock);

      const query = `
        {
          assetList(id: ${id}, page: ${page}, pageSize: ${pageSize}) {
            assets {
              id
              type
              slug
              datePublished
              description
              headline
              title
            }
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetListMock));
    });

    it('should let you query for all the fields at once with an include parameter', async () => {
      const id = 100010507;
      const page = 1;
      const pageSize = 2;
      const include = '["cnbcnewsstory", "partnerstory"]';
      const CAPIAssetListMock = require(`./mocks/capi/${id}/includeParameter.json`);
      const PhoenixQLAssetListMock = require(`./mocks/assetList/${id}/includeParameter.json`);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id}?.*`))
        .reply(200, CAPIAssetListMock);

      const query = `
        {
          assetList(id: ${id}, page: ${page}, pageSize: ${pageSize}, include: ${include}) {
            assets {
              id
              type
              slug
              datePublished
              description
              headline
              title
            }
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetListMock));
    });


    it('should return the same results as using the include parameter using only the spread operator', async () => {
      const id = 100010507;
      const page = 1;
      const pageSize = 2;
      const CAPIAssetListMock = require(`./mocks/capi/${id}/includeParameter.json`);
      const PhoenixQLAssetListMock = require(`./mocks/assetList/${id}/includeParameter.json`);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id}?.*`))
        .reply(200, CAPIAssetListMock);

      const query = `
        {
          assetList(id: ${id}, page: ${page}, pageSize: ${pageSize}) {
            assets {
              ...on cnbcnewsstory {
                id
                type
                slug
                datePublished
                description
                headline
                title
              }
              ...on partnerstory {
                id
                type
                slug
                datePublished
                description
                headline
                title
              }
            }
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetListMock));
    });

    it('should let you query for all the fields with an exclude parameter', async () => {
      const id = 100010507;
      const page = 1;
      const pageSize = 2;
      const exclude = '["cnbcnewsstory", "partnerstory"]';
      const CAPIAssetListMock = require(`./mocks/capi/${id}/excludeParameter.json`);
      const PhoenixQLAssetListMock = require(`./mocks/assetList/${id}/excludeParameter.json`);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id}?.*`))
        .reply(200, CAPIAssetListMock);

      const query = `
      {
        assetList(id: 100010507, page: ${page}, pageSize: ${pageSize}, exclude: ${exclude}) {
          assets {
            id
            type
            ...on blogpost {
              slug
              datePublished
            }
            ...on slideshow {
              headline
              description
            }
          }
        }
      }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetListMock));
    });
  });
});
