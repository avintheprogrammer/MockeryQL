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
  shorterDescription
  datePublished
  description
  headline
  url
  name
  premium
  native
  image
  sameAs
  socialMediaInfo {
    url
    displayText
    type
  }
  body
  keyPoints
`;

describe('Creator', () => {
  describe('should return all of an creator\'s queryable fields', async () => {
    const id = 103944451;
    const url = '/testcreator/';
    const CAPISectionMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLCreatorMock = require(`./mocks/creator/${id}.json`);

    it('should return the fields by id', async () => {
      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPISectionMock);

      const query = `
        query {
          creator(id: ${id}) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLCreatorMock));
    });

    it('should return the fields by url', async () => {
      nock(nockHost)
        .get(`/url/${encodeURIComponent(url)}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPISectionMock);

      const query = `
        query {
          creator(url: "${url}") {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLCreatorMock));
    });
  });
});
