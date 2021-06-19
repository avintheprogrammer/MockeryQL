import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id
  type
  brand
  slug
  summary
  linkHeadline
  shorterDescription
  datePublished
  description
  headline
  url
  name
  premium
  native
  image {
    id
    type
    contentSize
    caption
    filter
    height
    id
    url
    datePublished
    dateModified
    dateLastPublished
    publisher {
      name
      logo
    }
    focalPoints {
      x
      y
      height
      width
    }
    copyrightHolder
    slug
    description
  }
  sameAs
  socialMediaInfo {
    url
    displayText
    type
  }
  body {
    content {
      tagName
      attributes
      children  
    }
  }
  keyPoints
`;

describe('Person', () => {
  describe('should return all of an person\'s queryable fields', () => {
    const id = 104754693;
    const url = '/karim-hajjar-solvay-s-a/';
    const CAPIPersonMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLPersonMock = require(`./mocks/person/${id}.json`);

    it('should return the fields by id', async () => {
      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIPersonMock);

      const query = `
        query {
          person(id: ${id}) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLPersonMock));
    });

    it('should return the fields by url', async () => {
      nock(nockHost)
        .get(`/url/${encodeURIComponent(url)}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIPersonMock);

      const query = `
        query {
          person(url: "${url}") {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLPersonMock));
    });
  });
});
