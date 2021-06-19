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
      ... on franchise {
        url
        datePublished
      }
    }
    assets {
      id
      type
    }
`;

const id1 = 20910258;
const id2 = 100004038;

describe('Sections', () => {
  describe("should return all of an section's queryable fields", () => {
    it('should return the fields by id', async () => {
      const PhoenixQLSectionMock = require(`./mocks/sections/${id1}-${id2}/queryableFields.json`);
      const CAPIIDSectionMock = require(`./mocks/capi/${id1}-${id2}/id.json`);
      const CAPIListIDSectionMock1 = require(`./mocks/capi/${id1}/listId.json`);
      const CAPIListIDSectionMock2 = require(`./mocks/capi/${id2}/listId.json`);

      nock(nockHost)
        .get(new RegExp(`/id/${id1},${id2}.*`))
        .reply(200, CAPIIDSectionMock);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id1}?.*`))
        .reply(200, CAPIListIDSectionMock1);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id2}?.*`))
        .reply(200, CAPIListIDSectionMock2);

      const query = `
        query {
          sections(ids: [${id1}, ${id2}]) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLSectionMock));
    });

    it('should return the fields by id with related content', async () => {
      const id = 100004038;
      const CAPIIDSectionMock = require(`./mocks/capi/${id}/id.json`);
      const PhoenixQLSectionMock = require(`./mocks/sections/${id}.json`);

      nock(nockHost)
        .get(new RegExp(`/id/${id}.*`))
        .reply(200, CAPIIDSectionMock);

      const query = `
        query {
          sections(ids: [${id2}]) {
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
      const PhoenixQLSectionMock = require(`./mocks/sections/${id1}-${id2}/assets.json`);
      const CAPIIDSectionMock = require(`./mocks/capi/${id1}-${id2}/id.json`);
      const CAPIListIDSectionMock1 = require(`./mocks/capi/${id1}/listId?includeAssetType=cnbcvideo.json`);
      const CAPIListIDSectionMock2 = require(`./mocks/capi/${id2}/listId?includeAssetType=cnbcvideo.json`);
      const count = 3;

      nock(nockHost)
        .get(new RegExp(`/id/${id1},${id2}.*`))
        .reply(200, CAPIIDSectionMock);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id1}?.*`))
        .reply(200, CAPIListIDSectionMock1);

      nock(nockHost)
        .get(new RegExp(`/list/id/${id2}?.*`))
        .reply(200, CAPIListIDSectionMock2);

      const query = `
        query {
          sections(ids: [${id1}, ${id2}]) {
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
  });
});
