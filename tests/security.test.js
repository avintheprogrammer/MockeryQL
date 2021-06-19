import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id
  url
  slug
  summary
  shorterDescription
  name
  type
  brand
  symbol
  native
  premium
  issueId
  publisher {
    name
    logo
  }
  contentUrl
  datePublished
  tickerSymbol
  exchangeName
  sourceOrganization {
    id
    url
    type
    slug
    name
    logo
    contentUrl
    description
  }
`;

describe('Security', () => {
  describe('should return all of a security\'s queryable fields', () => {
    const id = 104816427;
    const CAPISecurityMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLSecurityMock = require(`./mocks/security/${id}.json`);

    it('should return the fields by id', async () => {
      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPISecurityMock);

      const query = `
        query {
          security(id:${id}) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLSecurityMock));
    });
  });
});
