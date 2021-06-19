import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id
  type
  slug
  title
  tabLabel
  headline
  sectionLabel
  brand
  contentUrl
  subType
  datePublished
  summary
  shorterDescription
  url
  showTime
  publisher {
    name
    logo
  }
  description
  name
  color
  sectionLinktext
  headerImage {
    id
    url
  }
  logo {
    id
    url
  }
  dateModified
  dateLastPublished
  navigation {
    id
    type
    name
    host
    path
  }
  body
  native
  premium
  featuredMedia {
    ... on image {
      id
    }
  }
  keyPoints
  image {
    id
  }
  related {
    type
    ...on franchise {
      url
      datePublished
    }
  }
  assets {
    id
    type
  }
`;

describe('Section', () => {
  describe("should return all of an section's queryable fields", () => {
    it('should return the fields by id', async () => {
      const id = 15839069;
      const PhoenixQLSectionMock = require(`./mocks/section/${id}/queryableFields.json`);
      const CAPIIDSectionMock = require(`./mocks/capi/${id}/id.json`);
      const CAPIListIDSectionMock = require(`./mocks/capi/${id}/listId.json`);

      nock(nockHost)
        .get(new RegExp(`/id/${id}.*`))
        .reply(200, CAPIIDSectionMock);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id}?.*`))
        .reply(200, CAPIListIDSectionMock);

      const query = `
        query {
          section(id: ${id}) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLSectionMock));
    });

    it('should return the fields by id with related content', async () => {
      const id = 100004038;
      const PhoenixQLSectionMock = require(`./mocks/section/${id}.json`);
      const CAPIIDSectionMock = require(`./mocks/capi/${id}.json`);

      nock(nockHost)
        .get(new RegExp(`/id/${id}.*`))
        .query({ partner: 'pql01' })
        .reply(200, CAPIIDSectionMock);

      const query = `
        query {
          section(id: ${id}) {
            relatedContent {
              id
              type
              url
              title
              promoImage {
                url
              }
              premium
            }
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLSectionMock));
    });

    it('should allow you to lookup assets with a count and includeContentTypes parameter', async () => {
      const id = 15839069;
      const PhoenixQLSectionMock = require(`./mocks/section/${id}/assets.json`);
      const CAPIIDSectionMock = require(`./mocks/capi/${id}/id.json`);
      const CAPIListIDSectionMock = require(`./mocks/capi/${id}/listId?includeAssetType=cnbcvideo.json`);
      const count = 5;

      nock(nockHost)
        .get(new RegExp(`/id/${id}.*`))
        .reply(200, CAPIIDSectionMock);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id}?.*`))
        .reply(200, CAPIListIDSectionMock);

      const query = `
        query {
          section(id: ${id}) {
            assets(count: ${count}, includeContentTypes: [cnbcvideo]) {
              id
              type
            }
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLSectionMock));
    });

    it('should return the carousel field', async () => {
      const id = 104847537;
      const CAPISectionMock = require(`./mocks/capi/${id}.json`);
      const PhoenixQLSectionMock = require(`./mocks/section/${id}.json`);

      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPISectionMock);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id}?.*`))
        .reply(200, "we don't need this data for our test");

      const query = `
        query {
          section(id: ${id}) {
            carousel {
              id
              title
              url
            }
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLSectionMock));
    });
  });

  it('should return a list assets of relationType:promo ', async () => {
    const id = 104847371;
    const CAPISectionMock = require(`./mocks/capi/${id}/id.json`);
    const PhoenixQLSectionMock = require(`./mocks/section/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPISectionMock);

    nock(nockHost)
      .get(new RegExp(`/list/id/${id}?.*`))
      .query({ partner: 'pql01' })
      .reply(200, "we don't need this data for our test");

    const query = `
      query {
        section(id: ${id}) {
          promoBucket {
            id
            type
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLSectionMock));
  });
});
